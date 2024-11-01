const handleSuccessfulCheckout = async () => {
    const checkoutItems = JSON.parse(sessionStorage.getItem('checkoutItems'));
    if (checkoutItems) {
        const userId = sessionStorage.getItem("userId");
        try {
            await fetch(`${BASE_URL}/api/cart/${userId}/removeMultiple`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productIds: checkoutItems }),
            });
            // Xóa checkoutItems khỏi sessionStorage sau khi đã xử lý
            sessionStorage.removeItem('checkoutItems');
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
        }
    }
}; 