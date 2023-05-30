class DrivingBase {
    
    // Defined constants
    public static readonly MOTOR_MAX_RPM = 140; // RPM of gearmotors
    public static readonly WHEEL_DIAMETER = 6.5; // Diameter of wheels
    // Calculated constants
    public static readonly MOTOR_MAX_DEGPS = DrivingBase.MOTOR_MAX_RPM*6; // Max degrees/s of gearmotors
    public static readonly MOTOR_MAX_RADPS = DrivingBase.MOTOR_MAX_RPM*0.10471975512 // Max radians/s of gearmotors
    public static readonly MOTOR_MAX_CMPS = DrivingBase.WHEEL_DIAMETER*DrivingBase.MOTOR_MAX_RPM*0.0523598775598; // Max cm/s of gearmotors

    // Movement-specific math
    public static distanceToTime(distance:number): number {
        return distance/DrivingBase.MOTOR_MAX_CMPS;
    }
    public static degreesToTime(degrees:number): number {
        return degrees/DrivingBase.MOTOR_MAX_DEGPS;
    }
    public static radiansToTime(radians:number): number {
        return radians/DrivingBase.MOTOR_MAX_RADPS;
    }
    public static modifyTimeBySpeed(time:number, speed:number): number {
        return Math.abs(time/(speed/100));
    }
    public static speedFromDistanceTime(distance:number, time:number): number {
        return distance/(time*DrivingBase.MOTOR_MAX_CMPS);
    }
    // Movement functions
    public static setBothMotors(direction:MotorDirection, speed:number): void {
        motobit.setMotorSpeed(Motor.Left, direction, speed);
        motobit.setMotorSpeed(Motor.Right, direction, speed);
    }
    public static stopMotors(): void {
        DrivingBase.setBothMotors(MotorDirection.Forward, 0);
    }
    public static turnMotorDegrees(degrees:number, speed:number, motor:Motor): void {
        const direction = degrees > 0 ? MotorDirection.Forward : MotorDirection.Reverse;
        const pauseTime = DrivingBase.modifyTimeBySpeed(DrivingBase.degreesToTime(degrees)*1000, speed);
        motobit.setMotorSpeed(motor, direction, speed);
        pause(pauseTime);
        motobit.setMotorSpeed(motor, direction, 0);
    }
    public static turnMotorDistance(distance:number, speed:number, motor:Motor): void {
        const direction = distance > 0 ? MotorDirection.Forward : MotorDirection.Reverse;
        const pauseTime = DrivingBase.modifyTimeBySpeed(DrivingBase.distanceToTime(distance)*1000, speed);
        motobit.setMotorSpeed(motor, direction, speed);
        pause(pauseTime);
        motobit.setMotorSpeed(motor, direction, 0);
    }
    public static moveConstructDistance(distance:number, speed:number): void {
        // NOTE: Positive degrees move construct forward and negative backward
        const direction = distance > 0 ? MotorDirection.Forward : MotorDirection.Reverse;
        const pauseTime = DrivingBase.modifyTimeBySpeed(DrivingBase.distanceToTime(distance)*1000, speed);
        DrivingBase.setBothMotors(direction, speed);
        pause(pauseTime);
        DrivingBase.stopMotors();
    }
    public static turnConstructDegrees(degrees:number, speed:number): void {
        // NOTE: Positive degrees turns construct left and negative turns right
        const leftDirection = degrees > 0 ? MotorDirection.Reverse : MotorDirection.Forward;
        const rightDirection = degrees > 0 ? MotorDirection.Forward : MotorDirection.Reverse;
        const pauseTime = DrivingBase.modifyTimeBySpeed(DrivingBase.degreesToTime(degrees*4)*1000, speed);
        motobit.setMotorSpeed(Motor.Left, leftDirection, speed);
        motobit.setMotorSpeed(Motor.Right, rightDirection, speed);
        pause(pauseTime);
        DrivingBase.stopMotors();
    }
    // Input functions
    public static waitForButtonPressed(button: Button): void {
        while (!input.buttonIsPressed(button)) { pause(5); }
    }
    // Other functions
    public static parallel(func:()=>void): void {
        control.runInParallel(func);
    }
}
