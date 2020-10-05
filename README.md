# Tookuw

I chalenge myself to build an interactive prototype using Bootstrap and Vanilla JS. And here it is the result: an interactive checkout screen.

I started with simple procedural approach and progress to OOP. It's not full fledged OOP app though, I just encapsulate some ui into its own class \[just select the branch to see how I implement these approach\]. 

## Features
Here are what you can do with this simple UI:
- **Search catalog** by typing out the name of product in catalog search bar
- **Add item to receipt** by clicking item in catalog
- **Update receipt item's quantity** by clicking the plus/minus button at each receipt item. Alternatively, you can click on the quantity and Tookuw will show you a quantity modal, then type out your quantity there. 
- **Apply a discount** by typing out the discount amount then click Apply Discount
- **Assign customer** to receipt by clicking the user (with plus) icon. Also, you can filter existing customer and create the new one.
- **Proceed to \[fake\] checkout** by clicking CHARGE then Tookuw will show you a Payment Modal where you can input the amount of received payment and select the payment method. It won't process the payment though, it's only for transaction recording purpose.
- **Animated alert** consist of warning and succesful alert 
- **Payment loader screen** which simulate a payment processing.
- **Responsive!**

While this prototype works, surely it's far from perfect, such as tight coupling, etc. If you have difficulty understanding the code, feel free to contact me. 