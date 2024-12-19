import OperationTile from "./OperationTile";
import { PiRobotThin, PiScanThin, PiUploadThin } from "react-icons/pi";
import { Link } from "react-router-dom";

const ChooseOperation = () => {
  return (
    <div className="flex flex-col md:flex-wrap w-full lg:w-5/6 mx-auto py-8 justify-center">
      <Link 
        className="w-full mx-2 md:w-auto md:mx-0" mt-1
        to={'/upload-pdf'}>
        <OperationTile
          icon={<PiUploadThin className="text-7xl text-black mx-auto" />}
          text={`Upload PDF`}
        ></OperationTile>
      </Link>

      <Link
        className="w-full mx-2 md:w-auto md:mx-0 mt-1"
        to={'/chat'}
        >
        <OperationTile
            icon={<PiRobotThin className="text-7xl text-black mx-auto" />}
            text={`Chat with AI`}
        ></OperationTile>
      </Link>

      <Link
        className="w-full mx-2 md:w-auto md:mx-0 mt-1"
        to={'/scanner'}
        >
        <OperationTile
            icon={<PiScanThin className="text-7xl text-black mx-auto" />}
            text={`AI Scanner \n Scan to solve`}
        ></OperationTile>
      </Link>
    </div>
  );
};

export default ChooseOperation;
