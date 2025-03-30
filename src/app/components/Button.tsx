type Props = {
  text: string;
  onClick?: () => void;
  color?: string;
  style?: string;
};

const Button = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      className={
        props.style
          ? props.style
          : `px-5 py-2 font-black text-white rounded-2xl csshadow-lt cursor-pointer ${
              props.color ? props.color : "bg-blue-500"
            } active:scale-95 transition-transform duration-150 ease-in-out`
      }
    >
      {props.text}
    </button>
  );
};

export default Button;
