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


RCT_EXPORT_METHOD(show:(NSString *)moduleName key:(nonnull NSNumber *)key options:(NSDictionary *)options) {
    HBDOverlay *overlay = self.overlays[key];
    if (overlay != nil) {
        [overlay update];
        return;
    }
    
    overlay = [self createOverlayWithModuleName:moduleName key:key];
    [overlay show:options];
}

RCT_EXPORT_METHOD(hide:(nonnull NSNumber *)key) {
    HBDOverlay *overlay = self.overlays[key];
    if (!overlay) {
        return;
    }
    [overlay hide];
}

- (HBDOverlay *)createOverlayWithModuleName:(NSString *)moduleName key:(NSNumber *)key {
    HBDOverlay *overlay = [[HBDOverlay alloc] initWithModuleName:moduleName key:key];
    self.overlays[key] = overlay;
    return overlay;
}


@end
