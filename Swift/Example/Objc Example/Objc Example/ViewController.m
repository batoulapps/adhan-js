//
//  ViewController.m
//  Objc Example
//
//  Created by Ameir Al-Zoubi on 4/26/16.
//  Copyright © 2016 Batoul Apps. All rights reserved.
//

#import "ViewController.h"
#import <CoreLocation/CoreLocation.h>
#import "Adhan/Adhan-Swift.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    NSCalendar *cal = [[NSCalendar alloc] initWithCalendarIdentifier:NSCalendarIdentifierGregorian];
    NSDateComponents *date = [cal components:NSCalendarUnitDay|NSCalendarUnitMonth|NSCalendarUnitYear fromDate:[NSDate date]];
    
    BACalculationParameters *params = [[BACalculationParameters alloc] initWithMethod:BACalculationMethodMuslimWorldLeague];
    params.madhab = BAMadhabHanafi;
    
    BACoordinates *coordinates = [[BACoordinates alloc] initWithLatitude:35.78056 longitude:-78.6389];
    
    BAPrayerTimes *prayerTimes = [[BAPrayerTimes alloc] initWithCoordinates:coordinates date:date calculationParameters:params];
    
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    formatter.timeZone = [[NSTimeZone alloc] initWithName:@"America/New_York"];
    formatter.timeStyle = NSDateFormatterMediumStyle;
    
    NSLog(@"fajr: %@", [formatter stringFromDate:prayerTimes.fajr]);
    NSLog(@"sunrise: %@", [formatter stringFromDate:prayerTimes.sunrise]);
    NSLog(@"dhuhr: %@", [formatter stringFromDate:prayerTimes.dhuhr]);
    NSLog(@"asr: %@", [formatter stringFromDate:prayerTimes.asr]);
    NSLog(@"maghrib: %@", [formatter stringFromDate:prayerTimes.maghrib]);
    NSLog(@"isha: %@", [formatter stringFromDate:prayerTimes.isha]);
}

@end
