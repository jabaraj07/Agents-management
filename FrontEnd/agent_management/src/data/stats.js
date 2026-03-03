export   const stats = [
    {
      title: "Total Clients",
      value: 200,
      color: "green",
      icon: (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <polyline points="9 9 12 6 15 9" />
          <line x1="12" y1="6" x2="12" y2="18" />
        </>
      ),
    },
    {
      title: "Total Properties",
      value: 10,
      color: "green",
      icon: (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <polyline points="7 15 10 12 13 15 17 11" />
        </>
      ),
    },
    {
      title: "Total Inspections",
      value: 2,
      color: "red",
      icon: (
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </>
      ),
    },
    {
      title: "Pending Inspections",
      value: 2,
      color: "yellow",
      icon: (
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="12" y1="14" x2="12" y2="18" />
          <line x1="10" y1="16" x2="14" y2="16" />
        </>
      ),
    },
    {
      title: "Closed Inspections",
      value: 10,
      color: "yellow",
      icon: (
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <polyline points="9 16 11 18 15 14" />
        </>
      ),
    },
  ];