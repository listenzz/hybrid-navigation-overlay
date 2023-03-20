#import "HBDOverlayModule.h"
#import <React/RCTLog.h>
#import <React/RCTBridge.h>
#import "HBDOverlay.h"

@interface HBDOverlayModule ()

@property(nonatomic, strong) NSMutableDictionary *overlays;

@end

@implementation HBDOverlayModule

@synthesize bridge;

- (instancetype)init {
    if (self = [super init]) {
        _overlays = [[NSMutableDictionary alloc] init];
    }
    return self;
}

- (void)handleReload {
    for (NSString *key in self.overlays) {
        HBDOverlay *overlay = self.overlays[key];
        [overlay hide];
    }
    [self.overlays removeAllObjects];
}

- (void)invalidate {
    [self handleReload];
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE(HBDOverlay)


RCT_EXPORT_METHOD(show:(NSString *)moduleName props:(NSDictionary *)props options:(NSDictionary *)options) {
    HBDOverlay *overlay = self.overlays[moduleName];
    if (overlay != nil) {
        [overlay update];
        return;
    }
    
    overlay = [[HBDOverlay alloc] initWithModuleName:moduleName bridge:self.bridge];
    self.overlays[moduleName] = overlay;
    
    [overlay show:props options:options];
}

RCT_EXPORT_METHOD(hide:(NSString *)moduleName) {
    HBDOverlay *overlay = self.overlays[moduleName];
    if (!overlay) {
        return;
    }
    [self.overlays removeObjectForKey:moduleName];
    [overlay hide];
}


@end
