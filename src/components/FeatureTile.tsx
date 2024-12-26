import { ReactNode } from "react";

interface tile {
    icon: ReactNode;
    heading: string;
    body: string;
}


const FeatureTile = (props: tile) => {
    return (
        <div className="w-11/12 md:w-1/3 xl:w-1/4 bg-black text-white flex flex-col gap-y-3 p-6 h-80 rounded-3xl hover:shadow-2xl cursor-pointer mx-auto md:mx-0 md:m-2">
            {props.icon}
            <h3 className="text-2xl font-bold text-white">{props.heading}</h3>
            <h3 className="text-white">{props.body}</h3>
        </div>
    )
}

export default FeatureTile;