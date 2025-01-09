import Lottie from "react-lottie";
import notFoundAnimationData from "./../assets/animations/404notfound.json";


export const notFoundAnimationOption = {
    loop: true,
    autoplay: true,
    animationData: notFoundAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };


const NotFound = () => {
    return (
        <div className="w-screen h-screen flex flex-col md:flex-row">
            <Lottie options={notFoundAnimationOption} height={screen.width < 768 ? 300 : 600} width={screen.width < 768 ? 400 : 800} />
        </div>
    )
}

export default NotFound;