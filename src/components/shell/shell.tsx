import { Outlet } from "react-router-dom";
import { Navigation } from "../navigation/nagivation";
import {
  ChatBubbleBottomCenterTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  Cog8ToothIcon,
  HomeIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { Capture } from "../capture/capture";
import { SidebarLayout } from "./sidebar-layout";
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from "./navbar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "./dropdown";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "./sidebar";

export const OldShell: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-0 justify-between items-center bg-emerald-500 p-1 lg:px-4 lg:py-2">
        <div className="flex items-center space-x-2 lg:space-x-8">
          <div className="flex items-center space-x-2 text-white">
            <ChatBubbleBottomCenterTextIcon className="w-7 h-7" />
            <h1 className="font-bold text-2xl tracking-narrow">
              What&apos;s Next?
            </h1>
          </div>
          <Navigation />
        </div>
        <div />
      </div>
      <Capture />
      <div className="flex-grow flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export const Shell: React.FC = () => {
  const pathname = "";
  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>avatar</DropdownButton>
              account dropdown
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <ChatBubbleBottomCenterTextIcon className="w-7 h-7" />
                <SidebarLabel>What's Next?</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu
                className="min-w-80 lg:min-w-64"
                anchor="bottom start"
              >
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="#">
                  avatar
                  <DropdownLabel>What's Next?</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="#">
                  avatar
                  <DropdownLabel>Big Events</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="#">
                  <PlusIcon />
                  <DropdownLabel>New team&hellip;</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem to="/">
                <HomeIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              <SidebarItem to="/wn">
                <Square2StackIcon />
                <SidebarLabel>What's Next?</SidebarLabel>
              </SidebarItem>
              <SidebarItem to="/fix">
                <TicketIcon />
                <SidebarLabel>Needs Attention</SidebarLabel>
              </SidebarItem>
              <SidebarItem to="/settings">
                <Cog6ToothIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSpacer />

            <SidebarSection>
              <SidebarItem href="#">
                <QuestionMarkCircleIcon />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#">
                <SparklesIcon />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  avatar
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                      Erica
                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      erica@example.com
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              account dropdown
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      <Capture />
      <Outlet />
    </SidebarLayout>
  );
};
