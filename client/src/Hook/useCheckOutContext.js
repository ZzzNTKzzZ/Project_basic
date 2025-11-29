import { createContext, useContext, useEffect, useState } from "react";

const CheckOutContext = createContext(null);

export function CheckOutProvider({children}) {
    const [checkoutItems, setCheckOutItems] = useState([]);

    return (
        <CheckOutContext.Provider value={{checkoutItems, setCheckOutItems}} >
            {children}
        </CheckOutContext.Provider>
    )
}

export function useCheckOut() {
    return useContext(CheckOutContext)
}