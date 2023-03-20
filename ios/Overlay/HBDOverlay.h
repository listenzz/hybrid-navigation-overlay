#import <UIKit/UIKit.h>

#import <React/RCTBridge.h>

@interface HBDOverlay : NSObject

- (instancetype)initWithModuleName:(NSString *)moduleName bridge:(RCTBridge *)bridge;

- (void)show:(NSDictionary *)props options:(NSDictionary *)options;

- (void)hide;

- (void)update;

@end
