const sidebarMenus = [
    {title: "Dashboard", icon:"fas fa-chart-pie", page:"/dashboard"},
    {title: "Associates", icon:"fas fa-hand-holding-usd", page:"associates"},
    //{title: "Credit Wallets", icon:"fas fa-hand-holding-usd", page:"credit_wallets"},
    //{title: "Update Rank", icon:"fas fa-hand-holding-usd", page:"update_rank"},
    {title: "Investments", icon:"fas fa-hand-holding-usd", page:"investments"},
    {title: "Transaction History", icon:"fas fa-hand-holding-usd", page:"transaction_history"},
    {title: "Income Histroy", icon:"fas fa-hand-holding-usd", page:"income_history"},
    {title: "Royalty Income", icon:"fas fa-hand-holding-usd", page:"royalty_income"},
    /* {title: "Withdrawal Requests", icon:"fas fa-hand-holding-usd", page:"withdrawl_requests"}, */
    /* {title: "Withdrawal Histroy", icon:"fas fa-hand-holding-usd", page:"widthdrawal_history"}, */
    {title: "Support Requests", icon:"fas fa-hand-holding-usd", page:"/dashboard/support"},
    {title: "Smart Wallet Credit Report", icon:"fas fa-cog", page:"/dashboard/smart_wallet_credit_report"},
    {title: "Announcement", icon:"fas fa-cog", page:"/dashboard/Announcement"},
    {title: "Statistics", icon:"fas fa-cog", page:"/dashboard/Statistics"},
    {title: "Settings", icon:"fas fa-cog", page:"settings"},
    {title: "Withdrawal Requests", icon:"fas fa-hand-holding-usd", childrens:[
        {title: "All Requests", page: "withdrawl_requests"},
        {title: "Date Wise Requests", page: "datewise_withdrawl_requests"},
    ]},
    {title: "Withdrawal History", icon:"fas fa-hand-holding-usd", childrens:[
        {title: "All Withdrawal", page: "widthdrawal_history"},
        // {title: "Date Wise Withdrawals", page: "datewise_widthdrawal_history"},
    ]},
    /* {title: "Components", icon:"fas fa-box-open", childrens:[
        {title: "Buttons", page: "/"},
        {title: "Notifications", page: "/"},
        {title: "Forms", page: "/"},
        {title: "Modals", page: "/"},
        {title: "Typography", page: "/"},
    ]}, */
    
]
export default sidebarMenus;