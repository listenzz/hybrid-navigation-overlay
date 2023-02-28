#import "HBDOverlay.h"

#import <HybridNavigation/HybridNavigation.h>
#import <HybridNavigation/HBDRootView.h>

@interface HBDOverlay ()

@property(nonatomic, weak) UIWindow *keyWindow;
@property(nonatomic, strong) HBDRootView *rootView;

@property(nonatomic, copy) NSString *moduleName;
@property(nonatomic, copy) NSNumber *key;

@end

@implementation HBDOverlay

- (instancetype)initWithModuleName:(NSString *)moduleName key:(NSNumber *)key {
    if (self = [super init]) {
        _moduleName = moduleName;
        _key = key;
    }
    return self;
}

- (void)show:(NSDictionary *)options {
    BOOL passThroughTouches = [options[@"passThroughTouches"] boolValue];
    
    RCTRootView *rctView = [self createReactRootView];
    rctView.passThroughTouches = passThroughTouches;
    rctView.frame = [UIScreen mainScreen].bounds;

    HBDRootView *view = [[HBDRootView alloc] initWithRootView:rctView];
    view.frame = [UIScreen mainScreen].bounds;
    view.backgroundColor = [UIColor clearColor];
    [view addSubview:rctView];
    
    self.rootView = view;
    
    UIWindow *keyWindow = [UIApplication sharedApplication].keyWindow;
    [keyWindow addSubview:view];
}

- (void)hide {
    if (self.rootView) {
        [self.rootView removeFromSuperview];
        self.rootView = nil;
    }
}

- (void)update {
    UIWindow *keyWindow = [UIApplication sharedApplication].keyWindow;
    if (keyWindow != self.keyWindow) {
        [self.rootView removeFromSuperview];
        [keyWindow addSubview:self.rootView];
        self.keyWindow = keyWindow;
    }
}

- (RCTRootView *)createReactRootView {
    NSDictionary *props = @{
        @"__overlay_key__" : self.key
    };
    
    RCTRootView *reactView = [[RCTRootView alloc] initWithBridge:[HBDReactBridgeManager get].bridge moduleName:self.moduleName initialProperties:props];
    reactView.backgroundColor = UIColor.clearColor;

    return reactView;
}

@end
