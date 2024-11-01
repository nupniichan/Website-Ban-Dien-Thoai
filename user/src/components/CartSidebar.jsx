import { Drawer } from "antd";
import { useState } from "react";

// TODO: make a slideout cart sidebar
const CartSidebar = ({ cartOpen, setCartOpen }) => {
    return (
        <Drawer
            title="Giỏ Hàng"
            onClose={() => setCartOpen(false)}
            open={cartOpen}
            width={400}
            footer={`Footer`}
        >
            <body>
                <p>Cart items here</p>
            </body>
        </Drawer>
    );
};

export default CartSidebar;
