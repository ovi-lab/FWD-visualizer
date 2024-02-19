'use client'
import Chatbox from "../chat/page";
import InfoPanel from "../info/page";
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
      <div className="grid grid-cols-7 row data-row">
          <InfoPanel
            
          />
          <div
            className="col-span-4"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {children}
          </div>
          <Chatbox />
        </div>
    );
  }