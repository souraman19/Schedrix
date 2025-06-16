    import mongoose, {Document, Schema, model, Types} from 'mongoose';

    export interface ITask extends Document {
        title: string;
        status: string; 
        duration: number; 
        startTime: Date;
        endTime: Date;
        deadline: Date;
        isLocked: boolean;
        isFixed: boolean;
        userOutput: {
        text: string;
        image: string[]; 
        video: string[];
        audio: string[];
        };
        userInput: {
        text: string;
        image: string[]; 
        audio: string[];
        video: string[];
        };
        OutputAnalysis: {
        text: string;
        image: string[]; 
        audio: string[]; 
        video: string[];
        };
        category: string; 
        createdBy: Types.ObjectId;
        priority: string; 
        tags: string[];
        pointsContributed: [{
            day: Date; 
            points: number; 
        }];
        totalPointsContributed: number;
        repeat: string;
        customRepeat: {
            repeatInteval: number;
            repeatUnit: string;
            endsType: string;
            endsOn:{
                date: Date; 
                afterOccurrences: number; 
                never: boolean; 
            };
            startDate: Date;
            weekDaysIfWeekInterval: string[]; 
            monthDaysIfMonthInterval: number[];
            yearDaysIfYearInterval: Date[];
        },
        isMaster: boolean;
        masterTaskId: Types.ObjectId | null; 
        masterStatus: string; // 'pending' | 'completed'
        reminder: {
            enabled: boolean;
            reminderTimeBefore: number; // in minutes
        };
    }

    
    const taskSchema = new Schema<ITask>({
        title: {type: String, required: true},
        status: {type: String, required: true, enum: ['pending', 'completed', 'overdue']},
        duration: {type: Number}, //// in mintutes format
        startTime: {type: Date},
        endTime: {type: Date},
        deadline: {type: Date},
        isLocked: {type: Boolean, default: false},
        isFixed: {type: Boolean, default: false},
        userOutput:{
            text: {type: String, default: ''},
            image: [{type: String}],
            video: [{type: String}],
            audio: [{type: String}],
        },
        userInput:{
            text: {type: String, default: ''},
            image: [{type: String}],
            video: [{type: String}],
            audio: [{type: String}],
        },
        OutputAnalysis:{
            text: {type: String, default: ''},
            image: [{type: String}],
            video: [{type: String}],
            audio: [{type: String}],
        },
        pointsContributed: [{
            day: {type: Date, default: () => new Date()},
            points: {type: Number, required: true},
        }],
        totalPointsContributed: {type: Number, default: 0},
        category: {type: String, required: true, enum: ['work', 'family', 'health', 'personal', 'other', 'learning']},
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        priority: {type: String, required: true, enum: ['low', 'medium', 'high', 'critical']},
        repeat: {type: String, enum: ['no repeat', 'repeat']},  //rember to make it reuired true at last
        customRepeat: {
            repeatInterval: {type: Number},
            repeatUnit: {type: String, enum: ['day', 'week', 'month', 'year']},
            endsType: {type: String, enum: ['date', 'afterOccurrences', 'never']},
            endsOn:{
                date: {type: Date},
                afterOccurrences: {type: Number}, // number of times to repeat
                never: {type: Boolean}, // never ends
            },
            startDate: {type: Date, default: () => new Date()}, 
            weekDaysIfWeekInterval: [{type: String}],
            monthDaysIfMonthInterval: [{type: Number}],
            yearDatesIfYearInterval: [{type: Date}],
        },
        tags: [{type: String}],
        isMaster: {type: Boolean, default: true},
        masterTaskId: {type: Schema.Types.ObjectId, ref: 'Task', default: null},
        masterStatus: {type: String, enum: ['pending', 'completed', 'N/A'], default: 'pending'},
        reminder:{
            enabled:  {type: Boolean, default: true},
            reminderTimeBefore: {type: Number, default: 10} // in minutes
        }
    }, {
        timestamps: true
    })


    //pre hook or pre save middleware to update the totalPointsContributed before saving the task
    taskSchema.pre<ITask>('save', function(next){
        this.totalPointsContributed = this.pointsContributed.reduce((total, entry) => total + entry.points, 0);
        next();
    })


    export const Task = model<ITask>('Task', taskSchema);