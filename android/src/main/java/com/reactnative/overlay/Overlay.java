package com.reactnative.overlay;

import static android.view.ViewGroup.LayoutParams.MATCH_PARENT;
import static android.view.ViewGroup.LayoutParams.WRAP_CONTENT;

import android.os.Bundle;
import android.view.Gravity;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.UiThread;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;
import com.navigation.androidx.AwesomeFragment;
import com.reactnative.hybridnavigation.HBDReactRootView;
import com.reactnative.hybridnavigation.ReactAppCompatActivity;
import com.reactnative.hybridnavigation.ReactBridgeManager;

@UiThread
public class Overlay {

    final ReactAppCompatActivity activity;
    final String moduleName;

    HBDReactRootView reactRootView;
    ViewGroup decorView;

    public Overlay(@NonNull ReactAppCompatActivity activity, String moduleName) {
        this.activity = activity;
        this.moduleName = moduleName;
    }

    public void show(int key) {
        HBDReactRootView reactRootView = createReactRootView();
        this.reactRootView = reactRootView;
        Bundle props = new Bundle();
        props.putInt("__overlay_key__", key);
        startReactApplication(reactRootView, props);
        decorView = getDecorView();
        if (decorView != null) {
            decorView.addView(reactRootView);
        }
    }

    public void hide() {
        if (decorView != null) {
            decorView.removeView(reactRootView);
            decorView = null;
        }

        unmountReactView();
    }

    public void update() {
        ViewGroup decorView = getDecorView();
        if (decorView != null && decorView != this.decorView) {
            this.decorView.removeView(reactRootView);
            this.decorView = decorView;
            decorView.addView(reactRootView);
        }
    }

    private void unmountReactView() {
        ReactBridgeManager bridgeManager = getReactBridgeManager();
        ReactContext reactContext = bridgeManager.getCurrentReactContext();

        if (reactContext == null || !reactContext.hasActiveCatalystInstance()) {
            return;
        }

        if (reactRootView != null) {
            reactRootView.unmountReactApplication();
            reactRootView = null;
        }
    }

    private void startReactApplication(HBDReactRootView reactRootView, Bundle props) {
        ReactBridgeManager bridgeManager = getReactBridgeManager();
        ReactInstanceManager reactInstanceManager = bridgeManager.getReactInstanceManager();
        reactRootView.startReactApplication(reactInstanceManager, moduleName, props);
    }

    private HBDReactRootView createReactRootView() {
        HBDReactRootView reactRootView = new HBDReactRootView(activity);
        reactRootView.setLayoutParams(new FrameLayout.LayoutParams(MATCH_PARENT, MATCH_PARENT, Gravity.CENTER));
        return reactRootView;
    }

    private ViewGroup getDecorView() {
        Window window = getWindow();
        if (window == null) {
            return null;
        }
        return (ViewGroup) window.getDecorView();
    }

    private Window getWindow() {
        AwesomeFragment fragment = activity.getDialogFragment();
        if (fragment != null) {
            return fragment.getWindow();
        }
        return activity.getWindow();
    }

    private final ReactBridgeManager bridgeManager = ReactBridgeManager.get();

    @NonNull
    public ReactBridgeManager getReactBridgeManager() {
        return bridgeManager;
    }

}
