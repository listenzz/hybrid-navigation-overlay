package com.reactnative.overlay;

import android.app.Activity;
import android.util.SparseArray;

import androidx.annotation.NonNull;

import com.facebook.common.logging.FLog;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UiThreadUtil;

public class OverlayModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private final SparseArray<Overlay> overlays = new SparseArray<>();
    private final ReactApplicationContext reactContext;

    private final ReactNativeHost reactNativeHost;

    public OverlayModule(ReactApplicationContext reactContext, ReactNativeHost reactNativeHost) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactNativeHost = reactNativeHost;
        reactContext.addLifecycleEventListener(this);
    }

    @Override
    public void invalidate() {
        reactContext.removeLifecycleEventListener(this);
        final Activity activity = getCurrentActivity();
        if (activity == null || activity.isFinishing()) {
            return;
        }
        UiThreadUtil.runOnUiThread(this::handleDestroy);
    }

    private void handleDestroy() {
        int size = overlays.size();
        for (int i = 0; i < size; i++) {
            Overlay overlay = overlays.get(overlays.keyAt(i));
            overlay.hide();
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "HBDOverlay";
    }

    @ReactMethod
    public void show(final String moduleName, final int key, final ReadableMap options) {
        UiThreadUtil.runOnUiThread(() -> {
            final Activity activity = getCurrentActivity();
            if (activity == null || activity.isFinishing()) {
                return;
            }
            Overlay overlay = overlays.get(key);
            if (overlay != null) {
                overlay.update();
                return;
            }
            createOverlay(moduleName, key, activity, options);
        });
    }

    private void createOverlay(String moduleName, int key, Activity activity, final ReadableMap options) {
        Overlay overlay = new Overlay(activity, moduleName, reactNativeHost.getReactInstanceManager());
        overlay.show(key, options);
        overlays.put(key, overlay);
    }

    @ReactMethod
    public void hide(int key) {
        UiThreadUtil.runOnUiThread(() -> {
            Overlay overlay = overlays.get(key);
            if (overlay == null) {
                return;
            }
            overlay.hide();
        });
    }

    @Override
    public void onHostResume() {
        UiThreadUtil.assertOnUiThread();
    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        FLog.i("OverlayModule", "onHostDestroy");
        handleDestroy();
    }
}
