//
//  ObjcTests.m
//  Adhan
//
//  Created by Ameir Al-Zoubi on 4/28/16.
//  Copyright © 2016 Batoul Apps. All rights reserved.
//

#import <XCTest/XCTest.h>
#import <Adhan/Adhan-Swift.h>
#import <CoreLocation/CoreLocation.h>

@interface ObjcTests : XCTestCase

@end

@implementation ObjcTests

- (void)testObjcInterface {
    NSDateComponents *date = [[NSDateComponents alloc] init];
    date.year = 2015;
    date.month = 7;
    date.day = 12;
    
    BACalculationParameters *params = [[BACalculationParameters alloc] initWithMethod:BACalculationMethodNorthAmerica];
    params.madhab = BAMadhabHanafi;
    
    BAPrayerTimes *p = [[BAPrayerTimes alloc] initWithCoordinates:CLLocationCoordinate2DMake(35.7750, -78.6389) date:date calculationParameters:params];
    
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    formatter.timeZone = [[NSTimeZone alloc] initWithName:@"America/New_York"];
    formatter.timeStyle = NSDateFormatterShortStyle;
    
    XCTAssertEqualObjects([formatter stringFromDate:p.fajr], @"4:42 AM");
    XCTAssertEqualObjects([formatter stringFromDate:p.sunrise], @"6:08 AM");
    XCTAssertEqualObjects([formatter stringFromDate:p.dhuhr], @"1:21 PM");
    XCTAssertEqualObjects([formatter stringFromDate:p.asr], @"6:22 PM");
    XCTAssertEqualObjects([formatter stringFromDate:p.maghrib], @"8:32 PM");
    XCTAssertEqualObjects([formatter stringFromDate:p.isha], @"9:57 PM");
}

- (BACalculationParameters *)parseParams:(NSDictionary *)dict {
    BACalculationParameters *params;
    
    NSString *method = dict[@"method"];
    
    if ([method isEqualToString:@"MuslimWorldLeague"]) {
        params = [[BACalculationParameters alloc] initWithMethod:BACalculationMethodMuslimWorldLeague];
    } else if ([method isEqualToString:@"Egyptian"]) {
        params = [[BACalculationParameters alloc] initWithMethod:BACalculationMethodEgyptian];
    } else if ([method isEqualToString:@"Karachi"]) {
        params = [[BACalculationParameters alloc] initWithMethod:BACalculationMethodKarachi];
    } else if ([method isEqualToString:@"UmmAlQura"]) {
        params = [[BACalculationParameters alloc] initWithMethod:BACalculationMethodUmmAlQura];
    } else if ([method isEqualToString:@"Gulf"]) {
        params = [[BACalculationParameters alloc] initWithMethod:BACalculationMethodGulf];
    } else if ([method isEqualToString:@"MoonsightingCommittee"]) {
        params = [[BACalculationParameters alloc] initWithMethod:BACalculationMethodMoonsightingCommittee];
    } else if ([method isEqualToString:@"NorthAmerica"]) {
        params = [[BACalculationParameters alloc] initWithMethod:BACalculationMethodNorthAmerica];
    } else if ([method isEqualToString:@"Kuwait"]) {
        params = [[BACalculationParameters alloc] initWithMethod:BACalculationMethodKuwait];
    } else if ([method isEqualToString:@"Qatar"]) {
        params = [[BACalculationParameters alloc] initWithMethod:BACalculationMethodQatar];
    } else {
        params = [[BACalculationParameters alloc] initWithMethod:BACalculationMethodOther];
    }
    
    NSString *madhab = dict[@"madhab"];
    
    if ([madhab isEqualToString:@"Shafi"]) {
        params.madhab = BAMadhabShafi;
    } else if ([madhab isEqualToString:@"Hanafi"]) {
        params.madhab = BAMadhabHanafi;
    }
    
    NSString *highLatRule = dict[@"highLatitudeRule"];
    
    if ([highLatRule isEqualToString:@"SeventhOfTheNight"]) {
        params.highLatitudeRule = BAHighLatitudeRuleSeventhOfTheNight;
    } else if ([highLatRule isEqualToString:@"TwilightAngle"]) {
        params.highLatitudeRule = BAHighLatitudeRuleTwilightAngle;
    } else {
        params.highLatitudeRule = BAHighLatitudeRuleMiddleOfTheNight;
    }
    
    return params;
}

- (void)testTimes {
    NSBundle *bundle = [NSBundle bundleForClass:[self class]];
    for (NSString *path in [bundle pathsForResourcesOfType:@"json" inDirectory:@"Times"]) {
        NSData *data = [NSData dataWithContentsOfFile:path];
        NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
        NSDictionary *params = json[@"params"];
        NSNumber *lat = params[@"latitude"];
        NSNumber *lon = params[@"longitude"];
        NSString *zone = params[@"timezone"];
        NSTimeZone *timezone = [NSTimeZone timeZoneWithName:zone];
        
        CLLocationCoordinate2D coordinates = CLLocationCoordinate2DMake(lat.doubleValue, lon.doubleValue);
        
        NSCalendar *cal = [NSCalendar calendarWithIdentifier:NSCalendarIdentifierGregorian];
        cal.timeZone = [NSTimeZone timeZoneWithName:@"UTC"];
        
        NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
        dateFormatter.dateFormat = @"YYYY-MM-dd";
        dateFormatter.timeZone = [NSTimeZone timeZoneWithName:@"UTC"];
        
        NSDateFormatter *timeFormatter = [[NSDateFormatter alloc] init];
        timeFormatter.dateFormat = @"h:mm a";
        timeFormatter.timeZone = timezone;
        
        NSArray *times = json[@"times"];
        NSLog(@"Testing %@ (%lu) days", path, (unsigned long)times.count);
        
        for (NSDictionary *time in times) {
            NSDate *date = [dateFormatter dateFromString:time[@"date"]];
            NSDateComponents *components = [cal components:NSCalendarUnitDay|NSCalendarUnitMonth|NSCalendarUnitYear fromDate:date];
            BAPrayerTimes *prayerTimes = [[BAPrayerTimes alloc] initWithCoordinates:coordinates date:components calculationParameters:[self parseParams:params]];
            XCTAssertEqualObjects([timeFormatter stringFromDate:prayerTimes.fajr], time[@"fajr"], @"Incorrect Fajr");
            XCTAssertEqualObjects([timeFormatter stringFromDate:prayerTimes.sunrise], time[@"sunrise"], @"Incorrect Sunrise");
            XCTAssertEqualObjects([timeFormatter stringFromDate:prayerTimes.dhuhr], time[@"dhuhr"], @"Incorrect Dhuhr");
            XCTAssertEqualObjects([timeFormatter stringFromDate:prayerTimes.asr], time[@"asr"], @"Incorrect Asr");
            XCTAssertEqualObjects([timeFormatter stringFromDate:prayerTimes.maghrib], time[@"maghrib"], @"Incorrect Maghrib");
            XCTAssertEqualObjects([timeFormatter stringFromDate:prayerTimes.isha], time[@"isha"], @"Incorrect Isha");
        }
    }
}

@end
