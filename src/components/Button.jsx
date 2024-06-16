export default function Button({ onClickFunction, text, cssClass }) {
  return (
    <button onClick={(e) => onClickFunction(e)} className={cssClass}>
      {text}
    </button>
  );
}
