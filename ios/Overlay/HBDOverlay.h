#import <UIKit/UIKit.h>

@interface HBDOverlay : NSObject

- (instancetype)initWithModuleName:(NSString *)moduleName key:(NSNumber *)key;

- (void)show:(NSDictionary *)options;

- (void)hide;

- (void)update;

@end
