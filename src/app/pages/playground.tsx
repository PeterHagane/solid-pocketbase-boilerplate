import { FaRegularChessKing } from "solid-icons/fa";
import { createSignal } from "solid-js";
import StatusIcon from "../components/statusIcon";

export const Playground = () => {
    const [check, toggleCheck] = createSignal<boolean>(false);
    const [cross, toggleCross] = createSignal<boolean>(false);
    const [loading, toggleLoading] = createSignal<boolean>(false);

    return (
        <>
           Playground

           <button onclick={()=>toggleCheck(!check())} class={"flex center gap"}>check </button>
                <button onclick={()=>toggleCross(!cross())}class={"flex center gap"}>cross </button>
                <button onclick={()=>toggleLoading(!loading())}class={"flex center gap"}>load </button>

                <StatusIcon
                    triggerCross={cross()}
                    triggerCheck={check()}
                    loading={loading()}
                >
                    <FaRegularChessKing></FaRegularChessKing>
                </StatusIcon>
        </>
    )
}

export default Playground;