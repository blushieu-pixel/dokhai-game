interface Props {
  status: string;
}

export default function OrderTimeline({ status }: Props) {
  const current =
    status === "pending"
      ? 0
      : status === "paid"
      ? 1
      : 2;

  const steps = [
    "Đặt hàng",
    "Đã thanh toán",
    "Đã giao",
  ];

  return (
    <div className="mt-8">

      <div className="relative flex justify-between items-center">

        <div className="absolute left-0 right-0 top-5 h-1 bg-slate-200 rounded-full"></div>

        <div
          className="absolute left-0 top-5 h-1 bg-blue-600 rounded-full transition-all duration-500"
          style={{
            width:
              current === 0
                ? "0%"
                : current === 1
                ? "50%"
                : "100%",
          }}
        ></div>

        {steps.map((step, index) => (

          <div
            key={step}
            className="relative flex flex-col items-center z-10"
          >

            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                index <= current
                  ? "bg-blue-600 text-white"
                  : "bg-white border-2 border-slate-300 text-slate-400"
              }`}
            >
              {index + 1}
            </div>

            <span className="mt-3 text-sm font-medium text-center w-24">
              {step}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}