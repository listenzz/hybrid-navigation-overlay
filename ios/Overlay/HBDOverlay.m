#import "HBDOverlay.h"

#import <HybridNavigation/HybridNavigation.h>
#import <HybridNavigation/HBDRootView.h>

@interface HBDOverlay ()

@property(nonatomic, weak) UIWindow *keyWindow;
@property(nonatomic, strong) HBDRootView *reactRootView;

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

- (void)show {
    NSDictionary *props = @{
        @"__overlay_key__" : self.key
    };
    HBDRootView *view = [[HBDRootView alloc] initWithBridge:[HBDReactBridgeManager get].bridge moduleName:self.moduleName initialProperties:props];
    view.frame = [UIScreen mainScreen].bounds;
    view.backgroundColor = [UIColor clearColor];
    self.reactRootView = view;
    UIWindow *keyWindow = [UIApplication sharedApplication].keyWindow;
    [keyWindow addSubview:view];
}

- (void)hide {
    if (self.reactRootView) {
        [self.reactRootView removeFromSuperview];
        self.reactRootView = nil;
    }
}

- (void)update {
    UIWindow *keyWindow = [UIApplication sharedApplication].keyWindow;
    if (keyWindow != self.keyWindow) {
        [self.reactRootView removeFromSuperview];
        [keyWindow addSubview:self.reactRootView];
        self.keyWindow = keyWindow;
    }
}

@end
