import { uuid } from "../../utils/Utils"
import cx from "classnames"
import css from "./accountisverified.module.scss"
import { userState } from "../stores/pocketBase";
import { FiEdit3 } from "solid-icons/fi";

export const AccountSettings =()=>{
    const ids = {
        name: "name" + uuid(),
        email: "email" + uuid(),
        phone: "phone" + uuid(),
        address: "address" + uuid(),
        city: "city" + uuid(),
        state: "state" + uuid(),
        zip: "zip" + uuid(),
    }

    return (
        <form class={cx("flex start center column gap-s form", css.card)}
            onSubmit={(e) => { e.preventDefault() }}
        >
            
            <input data-editable id={ids.name} type="text" placeholder={""} value={userState().user?.username}></input>
            <label data-translate for={ids.name}>{"Username"} </label>
            <FiEdit3 data-edit size={22}/>

            <input data-editable id={ids.name} type="text" placeholder={""} value={""}></input>
            <label data-translate for={ids.name}>{"Username"} </label>
            <FiEdit3 data-edit size={22}/>

            <input data-editable id={ids.name} type="text" placeholder={""} value={""}></input>
            <label data-translate for={ids.name}>{"Username"} </label>
            <FiEdit3 data-edit size={22}/>

            <input data-editable id={ids.name} type="text" placeholder={""} value={""}></input>
            <label data-translate for={ids.name}>{"Username"} </label>
            <FiEdit3 data-edit size={22}/>
           
            <button data-translate type="submit">Save</button>
    </form>
    )
}