import { Fade } from "react-awesome-reveal";

interface title{
    text:string;
}

const HomepageTitle = (prop:title) => {
    return (
        <Fade direction="up" delay={350} duration={500}>
            <div className="bg-black px-8 py-3 rounded-xl text-xl text-white shadow-2xl flex flex-row items-center justify-center mx-auto gap-x-3 w-52">
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <h3 className="text-white text-xl">{prop.text}</h3>
            </div>
        </Fade>
    )
}

export default HomepageTitle;