import ChooseOperation from "../components/ChooseOperation";
import Header from "../components/Header";

const Home = () => {
    return (
        <>
            <Header></Header>
            <div className="w-full h-full">
                <ChooseOperation></ChooseOperation>
            </div>
        </>
    )
};


export default Home;