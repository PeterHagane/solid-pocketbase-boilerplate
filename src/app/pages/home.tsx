import { isMobile } from "../../utils/Utils";

export const Home = () => {
    return (
        <>
            Home {isMobile() ? "Mobile" : "Desktop"} {navigator?.userAgent}
        </>
    )
}

export default Home;