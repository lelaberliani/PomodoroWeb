import { Timer, Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface NavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const Footer = ({ activeTab, onTabChange }: NavigationProps) => {
    const currentYear = new Date().getFullYear();

    const tabs = [
        { id: 'home', label: 'Home' },
        { id: 'timer', label: 'Timer' },
        { id: 'tasks', label: 'Tasks' },
        { id: 'statistics', label: 'Statistics' },
        { id: 'leaderboard', label: 'Leaderboard' },
    ];

    return (
        <>
            <footer className="relative mt-20 border-t border-white/10">
                {/* Gradient Glow Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#4DC3FF] to-transparent opacity-50" />

                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Brand Section */}
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#4DC3FF] to-[#A470FF] rounded-xl blur-lg opacity-60" />
                                    <div className="relative bg-gradient-to-br from-[#4DC3FF] to-[#A470FF] p-2 rounded-xl">
                                        <Timer className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <span className="text-lg tracking-wider text-white">
                                    POMODORO
                                </span>
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed">
                                Focus. Work. Achieve. Master your time with our futuristic
                                productivity app.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white mb-4">Quick Links</h3>
                            <div className="flex flex-col gap-2 items-start">
                                {tabs.map((tab) => {
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => onTabChange(tab.id)}
                                            className="text-sm text-white/60 hover:text-[#4DC3FF] transition-colors"
                                        >
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                        </div>

                        {/* Resources */}
                        <div>
                            <h3 className="text-white mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="text-sm text-white/60 hover:text-[#4DC3FF] transition-colors"
                                    >
                                        About Pomodoro
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-sm text-white/60 hover:text-[#4DC3FF] transition-colors"
                                    >
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-sm text-white/60 hover:text-[#4DC3FF] transition-colors"
                                    >
                                        Support
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-sm text-white/60 hover:text-[#4DC3FF] transition-colors"
                                    >
                                        Privacy Policy
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Connect */}
                        <div>
                            <h3 className="text-white mb-4">Connect</h3>
                            <p className="text-sm text-white/60 mb-4">
                                Follow us for updates and productivity tips.
                            </p>
                            <div className="flex items-center gap-3">
                                <a href="#" className="group relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#4DC3FF] to-[#A470FF] rounded-lg blur opacity-0 group-hover:opacity-60 transition-opacity" />
                                    <div className="relative p-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 transition-colors">
                                        <Github className="w-5 h-5 text-white" />
                                    </div>
                                </a>
                                <a href="#" className="group relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#4DC3FF] to-[#A470FF] rounded-lg blur opacity-0 group-hover:opacity-60 transition-opacity" />
                                    <div className="relative p-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 transition-colors">
                                        <Twitter className="w-5 h-5 text-white" />
                                    </div>
                                </a>
                                <a href="#" className="group relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#4DC3FF] to-[#A470FF] rounded-lg blur opacity-0 group-hover:opacity-60 transition-opacity" />
                                    <div className="relative p-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 transition-colors">
                                        <Linkedin className="w-5 h-5 text-white" />
                                    </div>
                                </a>
                                <a href="#" className="group relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#4DC3FF] to-[#A470FF] rounded-lg blur opacity-0 group-hover:opacity-60 transition-opacity" />
                                    <div className="relative p-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 transition-colors">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-white/50">
                                © {currentYear} Pomodoro Productivity. All rights reserved.
                            </p>
                            <div className="flex items-center gap-1 text-sm text-white/50">
                                <span>Made with</span>
                                <Heart className="w-4 h-4 text-[#A470FF] fill-[#A470FF]" />
                                <span>for productivity enthusiasts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
