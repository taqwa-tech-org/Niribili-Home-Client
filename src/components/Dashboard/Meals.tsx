import MealCard from "@/components/Dashboard/MealCard";

export default function Meals() {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");

  const handleMealOrder = async (mealType: string, price: number) => {
    if (!userName || !userEmail) {
      alert("Please login first");
      return;
    }

    const orderData = {
      userName,
      userEmail,
      mealType,
      price,
      date: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:5000/api/meal-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Meal ordered successfully ✅");
      } else {
        alert(data.message || "Failed to order meal");
      }
    } catch (error) {
      alert("Server error");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      <MealCard
        type="breakfast"
        price={150}
        time="7:00 AM - 9:00 AM"
        onOrder={handleMealOrder}
      />
      <MealCard
        type="lunch"
        price={250}
        time="12:00 PM - 2:00 PM"
        onOrder={handleMealOrder}
      />
      <MealCard
        type="dinner"
        price={200}
        time="7:00 PM - 9:00 PM"
        onOrder={handleMealOrder}
      />
    </div>
  );
}
