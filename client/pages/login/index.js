import React from "react";

export default function LoginPage() {

    function formatAccountData() {
        console.log("run")
    }

    return (
        <form action={formatAccountData}>
            <input name=''/>
            <button>Log in</button>
        </form>
    )
}