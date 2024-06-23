import { useContext } from "react";
import { LanguageContext } from "../../App.jsx";

export default function Dashboard() {
  const currentLanguage = useContext(LanguageContext);

  return (
    <div>
      {/* <List
        listName={language.messages[currentLanguage]}
        // count={"5"}
        viewAllLabel={language.viewAllMessages[currentLanguage]}
        notFoundLabel={language.messagesNotFound[currentLanguage]}
        // items={[
        //   <li>Ahmed</li>,
        //   <li>mohamed</li>,
        //   <li>mohamed</li>,
        //   <li>mohamed</li>,
        //   <li>Ahmed</li>,
        //   <li>mohamed</li>,
        //   <li>mohamed</li>,
        //   <li>mohamed</li>,
        //   <li>Ahmed</li>,
        //   <li>mohamed</li>,
        //   <li>mohamed</li>,
        //   <li>mohamed</li>,
        // ]}
      /> */}
    </div>
  );
}
