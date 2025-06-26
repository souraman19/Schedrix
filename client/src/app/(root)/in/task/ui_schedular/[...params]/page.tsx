import UISchedular from "@/components/task/UISchedular";


export default async function UI({params}: {params: Promise<{x: string}>}){
    const [currYear, currMonth, currDay] = ((await params) as any).params;

    return (<div> 
        <UISchedular currDay={currDay} currMonth={currMonth} currYear={currYear}/>
    </div>)
}