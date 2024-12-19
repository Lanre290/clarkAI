import { ReactNode } from "react";
import { GoLinkExternal } from "react-icons/go";

interface OperationTile{
    icon:ReactNode;
    text:string;
}

const OperationTile = (params: OperationTile) => {
    return (
        <div className="w-11/12 md:w-96 h-64 flex flex-col items-center justify-center rounded-3xl shadow-2xl m-2 md:m-5 operation-tile cursor-pointer hover:bg-gray-100">
            <div className="w-full items-center justify-center">
                {params.icon}
            </div>
            <h3 className="text-black w-full p-4 text-center">
                {params.text}
            </h3>

            <GoLinkExternal className="text-black cursor-pointer text-3xl arrow"></GoLinkExternal>
        </div>
    )
}

export default OperationTile;