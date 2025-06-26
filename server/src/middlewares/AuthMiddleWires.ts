export const isAuthenticated = (req: any, res: any, next: any) => {
    if(req.isAuthenticated()) {
        console.log("User is authenticated");
        return next(); 
    }
    console.log("User is not authenticated");
    res.status(401).json({ message: 'User not authenticated' }); 
}