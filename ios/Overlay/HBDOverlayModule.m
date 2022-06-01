#import "HBDOverlayModule.h"
#import <React/RCTLog.h>
#import <React/RCTBridge.h>
#import "HBDOverlay.h"

@interface HBDOverlayModule ()

@property(nonatomic, strong) NSMutableDictionary *overlays;

@end

@implementation HBDOverlayModule

- (instancetype)init {
    if (self = [super init]) {
        _overlays = [[NSMutableDictionary alloc] init];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleReload) name:RCTBridgeWillReloadNotification object:nil];
    }
    return self;
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self name:RCTBridgeWillReloadNotification object:nil];
}

- (void)handleReload {
    for (NSNumber *key in self.overlays) {
        HBDOverlay *overlay = self.overlays[key];
        [overlay hide];
    }
    [self.overlays removeAllObjects];
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE(HBDOverlay)


RCT_EXPORT_METHOD(showOverlay:(NSString *)moduleName key:(nonnull NSNumber *)key) {
    HBDOverlay *overlay = self.overlays[key];
    if (overlay != nil) {
        [overlay update];
        return;
    }
    [self createOverlayWithModuleName:moduleName key:key];
}

RCT_EXPORT_METHOD(hideOverlay:(nonnull NSNumber *)key) {
    HBDOverlay *overlay = self.overlays[key];
    if (!overlay) {
        return;
    }
    [overlay hide];
}

- (void)createOverlayWithModuleName:(NSString *)moduleName key:(NSNumber *)key {
    HBDOverlay *overlay = [[HBDOverlay alloc] initWithModuleName:moduleName key:key];
    self.overlays[key] = overlay;
    [overlay show];
}


@end
