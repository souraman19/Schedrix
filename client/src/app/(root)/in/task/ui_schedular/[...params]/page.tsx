import Navbar from "@/components/Navbar";
import UISchedular from "@/components/task/UISchedular";


export default async function UI({params}: {params: Promise<{x: string}>}){
    const [currYear, currMonth, currDay] = (await params).params;

    return (<> 
        <UISchedular currDay={currDay} currMonth={currMonth} currYear={currYear}/>
    </>)
}