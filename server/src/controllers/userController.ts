import { UserPoints } from "../models/UserPoints"

export const getPointAnalytics = async(req: any, res: any) => {
    try{
        const userId = req.user._id; 
        const year = new Date().getFullYear();

        const userPoints = await UserPoints.findOne({userId, year});
        if(!userPoints){
            return res.status(200).json({message: "No points found for this year", points:[]})
        }

        return res.status(200).json({points: userPoints.points})
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal server error"})
    }
}