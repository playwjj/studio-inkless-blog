CREATE TABLE newsletters (                                                                                                                                                           
       id INTEGER PRIMARY KEY AUTOINCREMENT,                                                                                                                                                            
       email TEXT NOT NULL UNIQUE,                                                                                                                                                                      
       status TEXT NOT NULL DEFAULT 'active',                                                                                                                                                           
       source TEXT DEFAULT 'homepage',                                                                                                                                                                  
       ip_address TEXT,                                                                                                                                                                                 
       user_agent TEXT,                                                                                                                                                                                 
       subscribed_at TEXT NOT NULL,                                                                                                                                                                     
       unsubscribed_at TEXT,                                                                                                                                                                            
       created_at TEXT NOT NULL,                                                                                                                                                                        
       updated_at TEXT NOT NULL                                                                                                                                                                         
);

CREATE INDEX IF NOT EXISTS idx_newsletters_email ON newsletters(email);                                                                                                                            
CREATE INDEX IF NOT EXISTS idx_newsletters_status ON newsletters(status);                                                                                                                          
CREATE INDEX IF NOT EXISTS idx_newsletters_subscribed_at ON newsletters(subscribed_at DESC);    