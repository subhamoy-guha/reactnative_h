/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTPushNotificationManager.h>

#import <Firebase.h>
#import "RNFirebaseNotifications.h"
#import "RNFirebaseMessaging.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import <FBSDKShareKit/FBSDKShareKit.h>

@import UserNotifications;

// define macro
#define SYSTEM_VERSION_GRATERTHAN_OR_EQUALTO(v)  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedAscending)

UNUserNotificationCenter *center;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  NSURL *jsCodeLocation;
  
#ifdef DEBUG
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"healingg"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  
  /* UIImage *image = [UIImage imageNamed:@"Healing_splash"];
   if (image) {
   UIImageView *launchView = [[UIImageView alloc] initWithImage: image];
   launchView.contentMode = UIViewContentModeCenter;
   launchView.image = image;
   rootView.loadingView = launchView;
   }*/
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  // self.window.backgroundColor = [UIColor colorWithPatternImage:imageview.image];
  rootView.backgroundColor = [UIColor colorWithWhite:0 alpha:0];
  rootView.layer.contents = (id)[UIImage imageNamed:@"splash_my"].CGImage;
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [self registerForRemoteNotification];
  
  if (launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey])
  {
    // opened from a push notification when the app is closed
    NSDictionary* userInfo = launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey];
    if (userInfo != nil)
    {
      NSDictionary *mainDict = userInfo;
      NSDictionary *dict;
      if([mainDict objectForKey:@"aps"] != nil){
        dict = [mainDict objectForKey:@"aps"];
      }
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 3 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
//        UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"options" message:[dict description] delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
//        [alertView show];
        [RCTPushNotificationManager didReceiveRemoteNotification:dict];
      });
      
    }
  }
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  return YES;
}

- (void)registerForRemoteNotification {
  if(SYSTEM_VERSION_GRATERTHAN_OR_EQUALTO(@"10.0")) {
    dispatch_async(dispatch_get_main_queue(), ^{
      center = [UNUserNotificationCenter currentNotificationCenter];
      center.delegate = self;
      [center requestAuthorizationWithOptions:(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge) completionHandler:^(BOOL granted, NSError * _Nullable error){
        if( !error ){
          dispatch_async(dispatch_get_main_queue(), ^{
            [[UIApplication sharedApplication] registerForRemoteNotifications];
          });
        }
      }];
    });
  }
  else {
    [[UIApplication sharedApplication] registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge) categories:nil]];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
  }
}

#pragma mark - UNUserNotificationCenter Delegate // >= iOS 10

- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler{
  
  NSLog(@"User Info = %@",notification.request.content.userInfo);
  
  completionHandler(UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound);
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)(void))completionHandler{
  
  NSLog(@"User Info = %@",response.notification.request.content.userInfo);
  NSDictionary *mainDict = response.notification.request.content.userInfo;
  NSDictionary *dict;
  if([mainDict objectForKey:@"aps"] != nil){
    dict = [mainDict objectForKey:@"aps"];
  }
  
  //  [RCTPushNotificationManager didReceiveRemoteNotification:response.notification.request.content.userInfo fetchCompletionHandler:nil];
  [RCTPushNotificationManager didReceiveRemoteNotification:dict];
  completionHandler();
}



- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  center.delegate = nil;
  center.delegate = self;
}


- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
                                                                openURL:url
                                                      sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                                             annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
                  ];
  // Add any custom logic here.
  return handled;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
 [FBSDKAppEvents activateApp];
}

//-(void) userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler {
//
//  [[RNFirebaseMessaging instance] didReceiveRemoteNotification:response.notification.request.content.userInfo];
//  completionHandler();
//}


// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}

// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}


@end
