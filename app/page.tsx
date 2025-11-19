"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home as HomeIcon,
  FileText,
  User,
  Settings,
  Briefcase,
  Users,
  Heart,
  DollarSign,
  Monitor,
  Grid3x3,
  HelpCircle,
  Search,
  ChevronRight,
  ChevronDown,
  CircleHelp,
  Info,
} from "lucide-react";

export default function Home() {
  const [activeApp, setActiveApp] = useState("Talent");
  const [categoryStates, setCategoryStates] = useState({
    "one-on-ones": true,
    "goals": true,
    "review-cycles": true,
    "time-off": true,
    "cars": true,
    "flights": true,
    "hotels": true,
  });
  const [emailPreference, setEmailPreference] = useState("all");
  const [inProductPreference, setInProductPreference] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    categoryId: string;
    settingId: string;
    settingName: string;
    isRequired: boolean;
  } | null>(null);
  
  // Individual category channel settings: { "categoryId-settingId": { email: boolean, inProduct: boolean } }
  const [categoryChannelSettings, setCategoryChannelSettings] = useState<Record<string, { email: boolean; inProduct: boolean }>>({});

  const getNotificationCategories = () => {
    if (activeApp === "Global settings") {
      return [
        {
          id: "global-settings",
          title: "Global settings",
          description:
            "Set how you'd like to receive Rippling notifications. These preferences will determine which notification options appear on each application page.",
          enabled: true,
          settings: [
            { 
              name: "Email", 
              channels: "Sent to your email address",
              isGlobalSetting: true,
            },
            { 
              name: "In-product notifications", 
              channels: "Delivered in the Notification Center, and will appear as a red badge on the bell icon, both on the web and mobile apps of Rippling",
              isGlobalSetting: true,
            },
          ],
        },
      ];
    }

    if (activeApp === "Talent") {
      return [
        {
          id: "one-on-ones",
          title: "1:1s",
          description:
            "Structured one-on-one meetings between managers and employees, providing tools to schedule, track, and document discussions to enhance communication and employee development",
          enabled: categoryStates["one-on-ones"],
          settings: [
            { name: "1:1 meeting invites", channels: "Email, In-product notifications" },
            { name: "1:1 meeting updates", channels: "Email, In-product notifications" },
            {
              name: "Announce 1:1s to everyone",
              channels: "Email, In-product notifications",
              required: true,
            },
          ],
        },
        {
          id: "goals",
          title: "Goals",
          description:
            "Set, track, and manage employee objectives and key results (OKRs), facilitating alignment across teams",
          enabled: categoryStates["goals"],
          settings: [
            { name: "Goal assignment", channels: "Email, In-product notifications" },
            { name: "Goal progress", channels: "Email, In-product notifications" },
            { name: "Goal update reminder", channels: "Email, In-product notifications" },
            { name: "Goals admin", channels: "Email, In-product notifications" },
          ],
        },
        {
          id: "review-cycles",
          title: "Review cycles",
          description:
            "Customize, schedule, and manage comprehensive feedback cycles to improve the employee performance review process",
          enabled: categoryStates["review-cycles"],
          settings: [
            { name: "Review cycles access", channels: "Email, In-product notifications" },
            { name: "Review cycles tasks", channels: "Email, In-product notifications" },
            { name: "Review cycles updates", channels: "Email, In-product notifications" },
          ],
        },
      ];
    }

    if (activeApp === "Time off") {
      return [
        {
          id: "time-off",
          title: "Time off",
          description:
            "Leave management product to easily request and track time off, while providing managers with tools to approve requests and monitor balances",
          enabled: categoryStates["time-off"],
          settings: [
            { name: "Time off approval required", channels: "Email, In-product notifications" },
            { name: "Time off miscellaneous", channels: "Email, In-product notifications" },
            { name: "Time off rejected", channels: "Email, In-product notifications" },
            { name: "Time off responsibility delegation", channels: "Email, In-product notifications" },
          ],
        },
      ];
    }

    if (activeApp === "Travel") {
      return [
        {
          id: "cars",
          title: "Cars",
          description:
            "Get alerted when employees book cars for business travel",
          enabled: categoryStates["cars"],
          settings: [
            { name: "New car bookings", channels: "Email, In-product notifications" },
          ],
        },
        {
          id: "flights",
          title: "Flights",
          description:
            "Monitor your company's flight spend and approve new booking requests",
          enabled: categoryStates["flights"],
          settings: [
            { name: "Flight approval requests", channels: "Email, In-product notifications" },
            { name: "Flight changes", channels: "Email, In-product notifications" },
            { name: "Flight pre-approval requests", channels: "Email, In-product notifications" },
            { name: "New flight bookings", channels: "Email, In-product notifications" },
            { name: "Pre-approval auto booking notifications", channels: "Email, In-product notifications" },
          ],
        },
        {
          id: "hotels",
          title: "Hotels",
          description:
            "Get alerted when employees book stays at hotels and other properties for business travel",
          enabled: categoryStates["hotels"],
          settings: [
            { name: "Hotel check-in instructions", channels: "Email, In-product notifications" },
            { name: "New hotel bookings", channels: "Email, In-product notifications" },
          ],
        },
      ];
    }

    // Fallback (should not reach here)
    return [];
  };

  const getFilteredChannels = (channels: string, isRequired: boolean, categoryId?: string, settingId?: string, categoryEnabled?: boolean) => {
    let filtered = channels;
    const settingKey = categoryId && settingId ? `${categoryId}-${settingId}` : null;
    const individualSettings = settingKey ? categoryChannelSettings[settingKey] : null;
    
    // Filter based on individual category settings first (always check these, regardless of category state)
    if (individualSettings) {
      if (!individualSettings.email) {
        filtered = filtered.replace(/Email,?\s*/g, "").trim();
      }
      if (!individualSettings.inProduct) {
        filtered = filtered.replace(/In-product notifications,?\s*/g, "").trim();
      }
    } else {
      // Apply global preferences if no individual settings
      // Filter based on email preference
      if (emailPreference === "required" && !isRequired) {
        filtered = filtered.replace(/Email,?\s*/g, "").trim();
      }
      
      // Filter based on in-product preference
      if (inProductPreference === "never") {
        filtered = filtered.replace(/In-product notifications,?\s*/g, "").trim();
      }
    }
    
    // Clean up any trailing commas
    filtered = filtered.replace(/^,\s*|\s*,\s*$/g, "").trim();
    
    // If empty, return "Off"
    return filtered || "Off";
  };

  const baseCategories = getNotificationCategories();
  
  // Auto-disable/enable categories based on filtered channels
  useEffect(() => {
    setCategoryStates(prev => {
      const updates: Record<string, boolean> = {};
      let hasUpdates = false;
      
      baseCategories.forEach((category) => {
        if (category.id === "global-settings") return;
        
        const currentEnabled = prev[category.id as keyof typeof prev] ?? true;
        
        // Check all settings, including those that are filtered out when disabled
        const visibleSettings = category.settings.filter((setting) => currentEnabled || (setting as any).required);
        
        const allOff = visibleSettings.every((setting) => {
          const isRequired = !!(setting as any).required;
          // For required items, always use original channels to preserve individual settings
          const channels = isRequired ? setting.channels : (currentEnabled ? setting.channels : setting.channels);
          const filtered = getFilteredChannels(channels, isRequired, category.id, setting.name, currentEnabled);
          // When category is disabled and item is required, only check if Email is enabled
          const displayChannels = !currentEnabled && isRequired 
            ? (filtered.includes("Email") ? "Email" : "Off")
            : filtered;
          return displayChannels === "Off";
        });

        const hasAnyChannels = visibleSettings.some((setting) => {
          const isRequired = !!(setting as any).required;
          // For required items, always use original channels to preserve individual settings
          const channels = isRequired ? setting.channels : (currentEnabled ? setting.channels : setting.channels);
          const filtered = getFilteredChannels(channels, isRequired, category.id, setting.name, currentEnabled);
          // When category is disabled and item is required, only check if Email is enabled
          const displayChannels = !currentEnabled && isRequired 
            ? (filtered.includes("Email") ? "Email" : "Off")
            : filtered;
          return displayChannels !== "Off";
        });

        // Check if category has required settings - if so, always keep it enabled
        const hasRequired = category.settings.some(setting => !!(setting as any).required);
        
        // Force enable if has required and currently disabled
        if (hasRequired && !currentEnabled) {
          updates[category.id] = true;
          hasUpdates = true;
        }
        // Auto-disable if all visible settings are off (but never disable if has required)
        else if (allOff && currentEnabled && visibleSettings.length > 0 && !hasRequired) {
          updates[category.id] = false;
          hasUpdates = true;
        }
        // Auto-enable if any have channels and currently disabled
        else if (hasAnyChannels && !currentEnabled) {
          updates[category.id] = true;
          hasUpdates = true;
        }
      });

      return hasUpdates ? { ...prev, ...updates } : prev;
    });
  }, [emailPreference, inProductPreference, activeApp, categoryChannelSettings]);

  const notificationCategories = baseCategories.map((category) => ({
    ...category,
    settings: category.settings.map((setting) => {
      const isRequired = !!(setting as any).required;
      // For required items, always use original channels so individual settings are preserved
      // For non-required items, when category is disabled, they're hidden anyway
      const channels = isRequired ? setting.channels : (category.enabled ? setting.channels : setting.channels);
      const filtered = getFilteredChannels(channels, isRequired, category.id, setting.name, category.enabled);
      // When category is disabled and item is required, only show Email if it's enabled
      // Individual settings are already applied in getFilteredChannels, so this just formats the display
      const displayChannels = !category.enabled && isRequired 
        ? (filtered.includes("Email") ? "Email" : "Off")
        : filtered;
      return {
        ...setting,
        filteredChannels: displayChannels,
      };
    }),
  }));

  // Calculate master toggle state (only for pages with more than 1 card)
  const hasMultipleCards = notificationCategories.length > 1 && activeApp !== "Global settings";
  const allCardsEnabled = hasMultipleCards && notificationCategories.every(cat => cat.enabled);
  const anyCardEnabled = hasMultipleCards && notificationCategories.some(cat => cat.enabled);
  // Master toggle is ON if at least one card is ON
  const masterToggleEnabled = hasMultipleCards ? anyCardEnabled : false;
  
  // Check if any category has required settings (for page level toggle)
  const hasRequiredInPage = notificationCategories.some(category => 
    category.settings.some(setting => !!(setting as any).required)
  );
  
  // Helper to check if a category has required settings
  const categoryHasRequired = (category: typeof notificationCategories[0]) => 
    category.settings.some(setting => !!(setting as any).required);

  // Sync individual category settings with global preferences
  useEffect(() => {
    if (inProductPreference === "never") {
      setCategoryChannelSettings(prev => {
        const updated = { ...prev };
        // Update all existing settings
        Object.keys(updated).forEach(key => {
          updated[key] = { ...updated[key], inProduct: false };
        });
        // Also initialize settings for all categories that don't have individual settings yet
        baseCategories.forEach(category => {
          if (category.id === "global-settings") return;
          category.settings.forEach(setting => {
            const key = `${category.id}-${setting.name}`;
            const isRequired = !!(setting as any).required;
            if (!updated[key]) {
              updated[key] = {
                email: !(emailPreference === "required" && !isRequired),
                inProduct: false,
              };
            } else {
              updated[key].inProduct = false;
            }
          });
        });
        return updated;
      });
    }
    
    if (emailPreference === "required") {
      setCategoryChannelSettings(prev => {
        const updated = { ...prev };
        // Update all existing settings
        Object.keys(updated).forEach(key => {
          const [categoryId, settingName] = key.split("-");
          const category = baseCategories.find(c => c.id === categoryId);
          const setting = category?.settings.find(s => s.name === settingName);
          // Don't disable email for required items
          const isRequired = !!(setting as any)?.required;
          if (!isRequired) {
            updated[key] = { ...updated[key], email: false };
          }
        });
        // Also initialize settings for all categories that don't have individual settings yet
        baseCategories.forEach(category => {
          if (category.id === "global-settings") return;
          category.settings.forEach(setting => {
            const key = `${category.id}-${setting.name}`;
            const isRequired = !!(setting as any).required;
            if (!updated[key]) {
              updated[key] = {
                email: !(emailPreference === "required" && !isRequired),
                inProduct: inProductPreference !== "never",
              };
            } else if (!isRequired) {
              updated[key].email = false;
            }
          });
        });
        return updated;
      });
    }
  }, [emailPreference, inProductPreference, activeApp]);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#502d3c] flex items-center gap-4 px-3 py-2 h-14">
        {/* Logo */}
        <div className="flex items-center justify-center w-8 h-8">
          <div className="text-white font-bold text-lg">M</div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-[400px]">
          <div className="bg-white border border-[#bfbebe] flex items-center gap-2 px-3 py-2 rounded-sm">
            <Search className="w-6 h-6 text-[#8c8888]" />
            <input
              type="text"
              placeholder="Search for anything (employees, apps, and more)"
              className="flex-1 text-[15px] text-[#8c8888] placeholder:text-[#8c8888] outline-none"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <span className="text-white text-[15px] font-medium">Support</span>
          <CircleHelp className="w-6 h-6 text-white" />
          <Info className="w-6 h-6 text-white" />
        </div>

        <Separator orientation="vertical" className="h-6 bg-white/30" />

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#c4c4c4] flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-[15px] font-medium leading-[22px]">
              Anne Montgomery
            </span>
            <span className="text-[#e0dede] text-[15px] leading-[22px]">
              Admin • Neuralink
            </span>
          </div>
          <ChevronDown className="w-6 h-6 text-white" />
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside className="w-14 bg-[#FFFFFF] border-r border-[#e0dede] fixed left-0 top-14 bottom-0 flex flex-col items-center pt-7 gap-2">
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#e8dae0] rounded-xl">
            <HomeIcon className="w-6 h-6" />
          </div>
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer bg-[#e8dae0] rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#e8dae0] rounded-xl">
            <User className="w-6 h-6" />
          </div>
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#e8dae0] rounded-xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#e8dae0] rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#e8dae0] rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#e8dae0] rounded-xl">
            <Heart className="w-6 h-6" />
          </div>
          <Separator className="w-10 my-2 bg-[#cdcdcd]" />
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#e8dae0] rounded-xl">
            <Monitor className="w-6 h-6" />
          </div>
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer bg-[#502d3c]/15 rounded-xl">
            <Settings className="w-6 h-6" />
          </div>
          <Separator className="w-10 my-2 bg-[#cdcdcd]" />
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#e8dae0] rounded-xl">
            <Grid3x3 className="w-6 h-6" />
          </div>
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#e8dae0] rounded-xl">
            <HelpCircle className="w-6 h-6" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-14">
          <div className="flex flex-col">
            {/* Page Header */}
            <div className="sticky top-14 z-40 bg-[#FFFFFF] pt-[26px] pb-0">
              <div className="px-14">
                <div className="h-[54px] flex items-center mb-6">
                  <h1 className="text-[24px] font-medium leading-[32px] text-black">
                    My Account Settings
                  </h1>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="notifications" className="w-full">
                <div className="border-b border-[#e0dede]">
                  <TabsList className="h-10 bg-transparent p-0 rounded-none px-14 border-0">
                    <TabsTrigger
                      value="notifications"
                      className="h-10 px-3 pb-3 rounded-none border-b-2 border-x-0 border-t-0 border-[#502d3c] data-[state=active]:border-[#502d3c] data-[state=active]:text-[#502d3c] text-[15px] font-medium tracking-[0.25px]"
                    >
                      Notifications
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="notifications" className="mt-0">
                  {/* Content Area */}
                  <div className="flex gap-0 bg-[#FAFAFA] pl-[56px]">
                    {/* Left Sidebar Navigation */}
                    <div className="w-[320px] bg-[#FAFAFA] border-l border-[#e0dede] mt-8">
                      <div className="flex flex-col">
                        <div
                          className={`min-h-[40px] flex items-center pl-[12px] py-2 cursor-pointer border-l-2 pt-4 relative ${
                            activeApp === "Global settings"
                              ? "border-[#202022] bg-transparent z-10"
                              : "border-transparent"
                          }`}
                          onClick={() => setActiveApp("Global settings")}
                        >
                          <span
                            className={`text-[16px] leading-6 tracking-normal ${
                              activeApp === "Global settings"
                                ? "font-medium text-[#202022]"
                                : "font-normal text-[#6f6f72]"
                            }`}
                          >
                            Global settings
                          </span>
                        </div>
                        <div className="text-[11px] font-medium text-[#a3a3a5] uppercase tracking-[1px] mb-2 pl-[12px] pt-4">
                          Apps
                        </div>
                        <div
                          className={`min-h-[40px] flex items-center pl-[12px] py-2 cursor-pointer border-l-2 relative ${
                            activeApp === "Talent"
                              ? "border-[#202022] bg-transparent z-10"
                              : "border-transparent"
                          }`}
                          onClick={() => setActiveApp("Talent")}
                        >
                          <span
                            className={`text-[16px] leading-6 tracking-normal ${
                              activeApp === "Talent"
                                ? "font-medium text-[#202022]"
                                : "font-normal text-[#6f6f72]"
                            }`}
                          >
                            Talent
                          </span>
                        </div>
                        <div
                          className={`min-h-[40px] flex items-center pl-[12px] py-2 cursor-pointer border-l-2 relative ${
                            activeApp === "Time off"
                              ? "border-[#202022] bg-transparent z-10"
                              : "border-transparent"
                          }`}
                          onClick={() => setActiveApp("Time off")}
                        >
                          <span
                            className={`text-[16px] leading-6 tracking-normal ${
                              activeApp === "Time off"
                                ? "font-medium text-[#202022]"
                                : "font-normal text-[#6f6f72]"
                            }`}
                          >
                            Time off
                          </span>
                        </div>
                        <div
                          className={`min-h-[40px] flex items-center pl-[12px] py-2 cursor-pointer border-l-2 relative pb-4 ${
                            activeApp === "Travel"
                              ? "border-[#202022] bg-transparent z-10"
                              : "border-transparent"
                          }`}
                          onClick={() => setActiveApp("Travel")}
                        >
                          <span
                            className={`text-[16px] leading-6 tracking-normal ${
                              activeApp === "Travel"
                                ? "font-medium text-[#202022]"
                                : "font-normal text-[#6f6f72]"
                            }`}
                          >
                            Travel
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Main Content Cards */}
                    <div className="flex-1 flex flex-col gap-6 mt-8 pr-[54px] mb-[54px]">
                      {/* Master Toggle - Only show if more than 1 card */}
                      {hasMultipleCards && (
                        <div className="bg-white border border-[#e0dede] rounded-2xl p-6 w-full max-w-full">
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <Switch 
                                      checked={masterToggleEnabled || hasRequiredInPage}
                                      onCheckedChange={(checked) => {
                                        if (hasRequiredInPage) return; // Prevent toggling if required
                                        // Update all card toggles
                                        const updates: Record<string, boolean> = {};
                                        notificationCategories.forEach(category => {
                                          if (!category.id.includes("global-settings")) {
                                            updates[category.id] = checked;
                                          }
                                        });
                                        setCategoryStates(prev => ({
                                          ...prev,
                                          ...updates
                                        }));
                                      }}
                                      disabled={hasRequiredInPage}
                                    />
                                  </div>
                                </TooltipTrigger>
                                {hasRequiredInPage && (
                                  <TooltipContent>
                                    <p>Some notifications are required</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                            <h2 className="text-[22px] font-medium leading-[26px] text-black tracking-normal">
                              {activeApp} notifications
                            </h2>
                          </div>
                        </div>
                      )}
                      {notificationCategories.map((category) => (
                        <div
                          key={category.id}
                          className="bg-white border border-[#e0dede] rounded-2xl p-6 w-full max-w-full"
                        >
                          {/* Category Header */}
                          <div className={category.enabled ? "mb-6" : "mb-0"}>
                            <div className="flex items-center gap-2 mb-2">
                              {!category.id.includes("global-settings") && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div>
                                        <Switch 
                                          checked={category.enabled || categoryHasRequired(category)}
                                          onCheckedChange={(checked) => {
                                            if (categoryHasRequired(category)) return; // Prevent toggling if required
                                            setCategoryStates(prev => ({
                                              ...prev,
                                              [category.id]: checked
                                            }));
                                            // If turning on a card and master toggle exists and was off, turn master toggle on
                                            if (checked && hasMultipleCards && !masterToggleEnabled) {
                                              // Master toggle will update automatically via masterToggleEnabled calculation
                                              // which is based on anyCardEnabled, so it will turn on when this card turns on
                                            }
                                          }}
                                          disabled={categoryHasRequired(category)}
                                        />
                                      </div>
                                    </TooltipTrigger>
                                    {categoryHasRequired(category) && (
                                      <TooltipContent>
                                        <p>Some notifications are required</p>
                                      </TooltipContent>
                                    )}
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              <h2 className="text-[22px] font-medium leading-[26px] text-black tracking-normal">
                                {category.title}
                              </h2>
                            </div>
                            <p className="text-[16px] leading-[23.04px] text-black">
                              {category.description}
                            </p>
                          </div>

                          {/* Settings List */}
                          <div className="flex flex-col">
                            {category.settings
                              .filter((setting) => category.enabled || !!(setting as any).required)
                              .map((setting, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between py-3 px-0 border-b border-[#ebe8e4] last:border-b-0 relative cursor-pointer hover:bg-[#FAFAFA]"
                                  onClick={() => {
                                    if (activeApp !== "Global settings") {
                                      setSelectedCategory({
                                        categoryId: category.id,
                                        settingId: setting.name,
                                        settingName: setting.name,
                                        isRequired: !!(setting as any).required,
                                      });
                                      setDrawerOpen(true);
                                    }
                                  }}
                                >
                                  <div className="flex flex-col">
                                    <span className="text-[16px] font-medium leading-6 text-[#202022] tracking-normal">
                                      {setting.name}
                                    </span>
                                    <span className="text-[12px] leading-4 text-[#6f6f72] mt-1 tracking-normal">
                                      {setting.filteredChannels}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {!!(setting as any).required && (
                                      <span className="px-2 py-1 text-[12px] font-medium text-[#6f6f72] bg-[#e0dede] rounded">
                                        Required
                                      </span>
                                    )}
                                    {!!(setting as any).isGlobalSetting ? (
                                      <Select 
                                        value={setting.name === "Email" ? emailPreference : inProductPreference}
                                        onValueChange={(value) => {
                                          if (setting.name === "Email") {
                                            setEmailPreference(value);
                                          } else {
                                            setInProductPreference(value);
                                          }
                                        }}
                                      >
                                        <SelectTrigger className="w-[300px] h-9 border border-[#e0dede] bg-white ml-6">
                                          <SelectValue>
                                            {setting.name === "Email" && emailPreference === "required"
                                              ? "Only send required notifications"
                                              : setting.name === "In-product notifications" && inProductPreference === "never"
                                              ? "Never send"
                                              : "Send only the notifications I've chosen"}
                                          </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="all">Send only the notifications I've chosen</SelectItem>
                                          {setting.name === "Email" ? (
                                            <SelectItem value="required" className="py-2">
                                              <div className="flex flex-col items-start gap-0.5">
                                                <span className="text-sm">Only send required notifications</span>
                                                <span className="text-xs text-[#6f6f72] font-normal">Some emails are required</span>
                                              </div>
                                            </SelectItem>
                                          ) : (
                                            <SelectItem value="never">Never send</SelectItem>
                                          )}
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <ChevronRight className="w-6 h-6 text-[#6f6f72]" />
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>

      {/* Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="right">
        <DrawerContent className="h-screen max-h-screen !w-3/4 !sm:max-w-4xl">
          <DrawerHeader>
            <div className="flex items-center gap-4">
              {selectedCategory && (() => {
                const key = `${selectedCategory.categoryId}-${selectedCategory.settingId}`;
                const settings = categoryChannelSettings[key];
                const emailEnabled = settings?.email ?? !(emailPreference === "required" && !selectedCategory.isRequired);
                const inProductEnabled = settings?.inProduct ?? (inProductPreference !== "never");
                // Title toggle is ON if at least one channel is ON
                const titleToggleEnabled = emailEnabled || inProductEnabled;
                const isRequired = selectedCategory.isRequired;
                const isDisabled = isRequired || ((emailPreference === "required" && !selectedCategory.isRequired) && inProductPreference === "never");
                return (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Switch
                            checked={titleToggleEnabled || isRequired}
                            onCheckedChange={(checked) => {
                              if (isRequired) return; // Prevent toggling if required
                              if (selectedCategory) {
                                const key = `${selectedCategory.categoryId}-${selectedCategory.settingId}`;
                                setCategoryChannelSettings(prev => ({
                                  ...prev,
                                  [key]: {
                                    email: checked && !(emailPreference === "required" && !selectedCategory.isRequired),
                                    inProduct: checked && inProductPreference !== "never",
                                  },
                                }));
                              }
                            }}
                            disabled={isDisabled}
                          />
                        </div>
                      </TooltipTrigger>
                      {isRequired && (
                        <TooltipContent>
                          <p>Some notifications are required</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })()}
              <DrawerTitle className="text-[24px] font-medium leading-[32px] text-black">
                {selectedCategory?.settingName}
              </DrawerTitle>
            </div>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto flex-1">
            <div className="bg-white rounded-2xl w-full">
              <div className="flex flex-col gap-6">
                {/* Email Setting */}
                <div className="flex items-center gap-4 py-3 px-0">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Switch
                            checked={
                              selectedCategory
                                ? (() => {
                                    const key = `${selectedCategory.categoryId}-${selectedCategory.settingId}`;
                                    const settings = categoryChannelSettings[key];
                                    if (settings) return settings.email;
                                    // Default: on unless global setting is "required" and not required
                                    return !(emailPreference === "required" && !selectedCategory.isRequired);
                                  })()
                                : true
                            }
                            onCheckedChange={(checked) => {
                              if (selectedCategory) {
                                const key = `${selectedCategory.categoryId}-${selectedCategory.settingId}`;
                                setCategoryChannelSettings(prev => {
                                  const newSettings = {
                                    ...prev,
                                    [key]: {
                                      ...prev[key],
                                      email: checked,
                                      inProduct: prev[key]?.inProduct ?? (inProductPreference !== "never"),
                                    },
                                  };
                                  // If all channels are off, title toggle should be off (handled by allChannelsEnabled calculation)
                                  return newSettings;
                                });
                              }
                            }}
                            disabled={
                              selectedCategory?.isRequired || 
                              (emailPreference === "required" && !selectedCategory?.isRequired)
                            }
                          />
                        </div>
                      </TooltipTrigger>
                      {(emailPreference === "required" && !selectedCategory?.isRequired) && (
                        <TooltipContent>
                          <p>Adjust global settings to enable this channel</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex flex-col">
                    <span className="text-[16px] font-medium leading-6 text-[#202022] tracking-normal">
                      Email
                    </span>
                    <span className="text-[12px] leading-4 text-[#6f6f72] mt-1 tracking-normal">
                      Sent to your email address
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-b border-[#ebe8e4]"></div>

                {/* In-product Notifications Setting */}
                <div className="flex items-center gap-4 py-3 px-0">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Switch
                            checked={
                              selectedCategory
                                ? (() => {
                                    const key = `${selectedCategory.categoryId}-${selectedCategory.settingId}`;
                                    const settings = categoryChannelSettings[key];
                                    if (settings) return settings.inProduct;
                                    // Default: on unless global setting is "never"
                                    return inProductPreference !== "never";
                                  })()
                                : true
                            }
                            onCheckedChange={(checked) => {
                              if (selectedCategory) {
                                const key = `${selectedCategory.categoryId}-${selectedCategory.settingId}`;
                                setCategoryChannelSettings(prev => {
                                  const newSettings = {
                                    ...prev,
                                    [key]: {
                                      ...prev[key],
                                      inProduct: checked,
                                      email: prev[key]?.email ?? (!(emailPreference === "required" && !selectedCategory.isRequired)),
                                    },
                                  };
                                  // If all channels are off, title toggle should be off (handled by allChannelsEnabled calculation)
                                  return newSettings;
                                });
                              }
                            }}
                            disabled={inProductPreference === "never"}
                          />
                        </div>
                      </TooltipTrigger>
                      {inProductPreference === "never" && (
                        <TooltipContent>
                          <p>Adjust global settings to enable this channel</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex flex-col">
                    <span className="text-[16px] font-medium leading-6 text-[#202022] tracking-normal">
                      In-product notifications
                    </span>
                    <span className="text-[12px] leading-4 text-[#6f6f72] mt-1 tracking-normal">
                      Delivered in the Notification Center, and will appear as a red badge on the bell icon, both on the web and mobile apps of Rippling
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
