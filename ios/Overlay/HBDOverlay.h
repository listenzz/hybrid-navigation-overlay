#import <UIKit/UIKit.h>

@interface HBDOverlay : NSObject

- (instancetype)initWithModuleName:(NSString *)moduleName key:(NSNumber *)key;

- (void)show;

- (void)hide;

- (void)update;

@end
