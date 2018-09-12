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
    
    BAPrayerTimes *p = [[BAPrayerTimes alloc] initWithCoordinates:[[BACoordinates alloc] initWithLatitude:35.7750 longitude:-78.6389] date:date calculationParameters:params];
    
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

- (void)testTimeForPrayer {
    NSDateComponents *date = [[NSDateComponents alloc] init];
    date.year = 2016;
    date.month = 7;
    date.day = 1;
    
    BACalculationParameters *params = [[BACalculationParameters alloc] initWithMethod:BACalculationMethodMuslimWorldLeague];
    params.madhab = BAMadhabHanafi;
    params.highLatitudeRule = BAHighLatitudeRuleTwilightAngle;
    BAPrayerTimes *p = [[BAPrayerTimes alloc] initWithCoordinates:[[BACoordinates alloc] initWithLatitude:59.9094 longitude:10.7349] date:date calculationParameters:params];
    XCTAssertEqualObjects(p.fajr, [p timeForPrayer:BAPrayerFajr]);
    XCTAssertEqualObjects(p.sunrise, [p timeForPrayer:BAPrayerSunrise]);
    XCTAssertEqualObjects(p.dhuhr, [p timeForPrayer:BAPrayerDhuhr]);
    XCTAssertEqualObjects(p.asr, [p timeForPrayer:BAPrayerAsr]);
    XCTAssertEqualObjects(p.maghrib, [p timeForPrayer:BAPrayerMaghrib]);
    XCTAssertEqualObjects(p.isha, [p timeForPrayer:BAPrayerIsha]);
    XCTAssertNil([p timeForPrayer:BAPrayerNone]);
}

- (void)testCurrentPrayer {
    NSDateComponents *date = [[NSDateComponents alloc] init];
    date.year = 2015;
    date.month = 9;
    date.day = 1;
    
    BACalculationParameters *params = [[BACalculationParameters alloc] initWithMethod:BACalculationMethodKarachi];
    params.madhab = BAMadhabHanafi;
    params.highLatitudeRule = BAHighLatitudeRuleTwilightAngle;
    BAPrayerTimes *p = [[BAPrayerTimes alloc] initWithCoordinates:[[BACoordinates alloc] initWithLatitude:33.720817 longitude:73.090032] date:date calculationParameters:params];
    XCTAssertEqual([p currentPrayer:[p.fajr dateByAddingTimeInterval:-1]], BAPrayerNone);
    XCTAssertEqual([p currentPrayer:[p.fajr dateByAddingTimeInterval:1]], BAPrayerFajr);
    XCTAssertEqual([p currentPrayer:[p.sunrise dateByAddingTimeInterval:1]], BAPrayerSunrise);
    XCTAssertEqual([p currentPrayer:[p.dhuhr dateByAddingTimeInterval:1]], BAPrayerDhuhr);
    XCTAssertEqual([p currentPrayer:[p.asr dateByAddingTimeInterval:1]], BAPrayerAsr);
    XCTAssertEqual([p currentPrayer:[p.maghrib dateByAddingTimeInterval:1]], BAPrayerMaghrib);
    XCTAssertEqual([p currentPrayer:[p.isha dateByAddingTimeInterval:1]], BAPrayerIsha);
}

- (void)testNextPrayer {
    NSDateComponents *date = [[NSDateComponents alloc] init];
    date.year = 2015;
    date.month = 9;
    date.day = 1;
    
    BACalculationParameters *params = [[BACalculationParameters alloc] initWithMethod:BACalculationMethodKarachi];
    params.madhab = BAMadhabHanafi;
    params.highLatitudeRule = BAHighLatitudeRuleTwilightAngle;
    BAPrayerTimes *p = [[BAPrayerTimes alloc] initWithCoordinates:[[BACoordinates alloc] initWithLatitude:33.720817 longitude:73.090032] date:date calculationParameters:params];
    XCTAssertEqual([p nextPrayer:[p.fajr dateByAddingTimeInterval:-1]], BAPrayerFajr);
    XCTAssertEqual([p nextPrayer:[p.fajr dateByAddingTimeInterval:1]], BAPrayerSunrise);
    XCTAssertEqual([p nextPrayer:[p.sunrise dateByAddingTimeInterval:1]], BAPrayerDhuhr);
    XCTAssertEqual([p nextPrayer:[p.dhuhr dateByAddingTimeInterval:1]], BAPrayerAsr);
    XCTAssertEqual([p nextPrayer:[p.asr dateByAddingTimeInterval:1]], BAPrayerMaghrib);
    XCTAssertEqual([p nextPrayer:[p.maghrib dateByAddingTimeInterval:1]], BAPrayerIsha);
    XCTAssertEqual([p nextPrayer:[p.isha dateByAddingTimeInterval:1]], BAPrayerNone);
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
    } else if ([method isEqualToString:@"Singapore"]) {
        params = [[BACalculationParameters alloc] initWithMethod:BACalculationMethodSingapore];
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

- (void)testQibla {
    BACoordinates *washingtonDC = [[BACoordinates alloc] initWithLatitude:38.9072 longitude:-77.0369];
    BAQibla *qibla = [[BAQibla alloc] initWithCoordinates:washingtonDC];
    XCTAssertEqualWithAccuracy(qibla.direction, 56.560, 0.001);
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
        
        BACoordinates *coordinates = [[BACoordinates alloc] initWithLatitude:lat.doubleValue longitude:lon.doubleValue];
        
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
