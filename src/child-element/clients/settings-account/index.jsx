import { Outlet } from "react-router-dom";
import BoxSettings from "./box-settings";
import "./settings-account.scss"
import useIsMobile from "../../../hooks/useIsMobile";

function SettingsAccount() {
  const isMobile = useIsMobile();

  return (
    <div className={`cb-section cb-section-padding-bottom bg-grey2${isMobile ? " settings-account--mobile" : ""}`}>
        <div className="container">
            <div className="row gx-4  justify-content-center">
                <Outlet/>
                <BoxSettings />
                
            </div>
           
        </div>
    </div>
  )
}
export default SettingsAccount;
