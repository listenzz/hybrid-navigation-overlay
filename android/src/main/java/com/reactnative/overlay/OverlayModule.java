package com.reactnative.overlay;

import android.app.Activity;
import android.util.SparseArray;

import androidx.annotation.NonNull;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.reactnative.hybridnavigation.ReactAppCompatActivity;

public class OverlayModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private final SparseArray<Overlay> overlays = new SparseArray<>();
    private final ReactApplicationContext reactContext;

    public OverlayModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        reactContext.addLifecycleEventListener(this);
    }

    @Override
    public void onCatalystInstanceDestroy() {
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
    public void showOverlay(final String moduleName, final int key) {
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
            createOverlay(moduleName, key, (ReactAppCompatActivity) activity);
        });
    }

    private void createOverlay(String moduleName, int key, ReactAppCompatActivity activity) {
        Overlay overlay = new Overlay(activity, moduleName);
        overlay.show(key);
        overlays.put(key, overlay);
    }

    @ReactMethod
    public void hideOverlay(int key) {
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
