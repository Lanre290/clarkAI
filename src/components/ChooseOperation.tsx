import OperationTile from "./OperationTile";
import { PiRobotThin, PiScanThin, PiUploadThin } from "react-icons/pi";
import { Link } from "react-router-dom";

const ChooseOperation = () => {
  return (
    <div className="flex flex-wrap w-full lg:w-5/6 mx-auto py-8 justify-center">
      <Link to={'/upload-pdf'}>
        <OperationTile
          icon={<PiUploadThin className="text-7xl text-black mx-auto" />}
          text={`Upload PDF`}
        ></OperationTile>
      </Link>

      <Link
        to={'/chat'}
        >
        <OperationTile
            icon={<PiRobotThin className="text-7xl text-black mx-auto" />}
            text={`Chat with AI`}
        ></OperationTile>
      </Link>

      <Link
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
