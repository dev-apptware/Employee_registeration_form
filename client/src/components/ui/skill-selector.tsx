import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define skill categories and their respective colors
export const SKILL_CATEGORIES = {
  DESIGN: { color: "bg-purple-100 border-purple-300 text-purple-800", icon: "🎨" },
  MARKETING: { color: "bg-green-100 border-green-300 text-green-800", icon: "📊" },
  SALES: { color: "bg-amber-100 border-amber-300 text-amber-800", icon: "💰" },
  HR: { color: "bg-pink-100 border-pink-300 text-pink-800", icon: "👥" },
  ACCOUNTS: { color: "bg-emerald-100 border-emerald-300 text-emerald-800", icon: "📈" },
  OPERATIONS: { color: "bg-indigo-100 border-indigo-300 text-indigo-800", icon: "⚙️" },
  FRONTEND: { color: "bg-orange-100 border-orange-300 text-orange-800", icon: "🌐" },
  BACKEND: { color: "bg-teal-100 border-teal-300 text-teal-800", icon: "🖥️" },
  DEVOPS: { color: "bg-yellow-100 border-yellow-300 text-yellow-800", icon: "🛠️" },
  AI: { color: "bg-violet-100 border-violet-300 text-violet-800", icon: "🤖" },
  PROJECT_DELIVERY: { color: "bg-rose-100 border-rose-300 text-rose-800", icon: "📆" },
  QA: { color: "bg-sky-100 border-sky-300 text-sky-800", icon: "🧪" },
};

// Map skills to categories
export const getCategoryForSkill = (skill: string) => {
  const lowerSkill = skill.toLowerCase();
  
  // Frontend skills
  if (lowerSkill.includes("react") || lowerSkill.includes("javascript") || lowerSkill.includes("vue") || lowerSkill.includes("react native") || 
      lowerSkill.includes("flutter") || lowerSkill.includes("android native") || 
      lowerSkill.includes("angular") || lowerSkill.includes("typescript") || 
      lowerSkill.includes("html/css") || lowerSkill.includes("tailwind") || 
      lowerSkill.includes("next.js") || lowerSkill.includes("redux") || 
      lowerSkill.includes("scss") || lowerSkill.includes("less") || 
      lowerSkill.includes("d3js")) {
    return "FRONTEND";
  }
  
  // Backend skills
  if (lowerSkill.includes("java") || lowerSkill.includes("python") || lowerSkill.includes("nodejs") || 
      lowerSkill.includes("expressjs") || lowerSkill.includes("mongodb") || 
      lowerSkill.includes("mysql") || lowerSkill.includes("postgresql") || 
      lowerSkill.includes("web services") || lowerSkill.includes("microservices") || 
      lowerSkill.includes("design patterns") || lowerSkill.includes("oops") || 
      lowerSkill.includes("serverless") || lowerSkill.includes("spring") || 
      lowerSkill.includes("jdbc") || lowerSkill.includes("maven") || 
      lowerSkill.includes("junit") || lowerSkill.includes("mockito") || 
      lowerSkill.includes("django") || lowerSkill.includes("flask") || 
      lowerSkill.includes("fastapi") || lowerSkill.includes("web sockets") || 
      lowerSkill.includes("elasticsearch") || lowerSkill.includes("etl") || 
      lowerSkill.includes("redis") || lowerSkill.includes("rabbitmq") || 
      lowerSkill.includes("graphdb") || lowerSkill.includes("neo4j") || 
      lowerSkill.includes("gradle")) {
    return "BACKEND";
  }
  
  // DevOps skills
  if (lowerSkill.includes("aws") || lowerSkill.includes("linux") || lowerSkill.includes("git") || 
      lowerSkill.includes("terraform") || lowerSkill.includes("ansible") || 
      lowerSkill.includes("docker") || lowerSkill.includes("kubernetes") || 
      lowerSkill.includes("jenkins") || lowerSkill.includes("github actions") || 
      lowerSkill.includes("prometheus") || lowerSkill.includes("grafana") || 
      lowerSkill.includes("azure") || lowerSkill.includes("gcp")) {
    return "DEVOPS";
  }
  
  // AI skills
  if (lowerSkill.includes("machine learning") || lowerSkill.includes("deep learning") || 
      lowerSkill.includes("generative ai") || lowerSkill.includes("rag") || 
      lowerSkill.includes("vectordb") || lowerSkill.includes("llm") || 
      lowerSkill.includes("knowledge graphs") || lowerSkill.includes("ai agents") || 
      lowerSkill.includes("computer vision") || lowerSkill.includes("nlp") || 
      lowerSkill.includes("eda") || lowerSkill.includes("exploratory data analysis") || 
      lowerSkill.includes("artificial intelligence")) {
    return "AI";
  }
  
  // QA skills
  if (lowerSkill.includes("selenium") || lowerSkill.includes("appium") || 
      lowerSkill.includes("junit") || lowerSkill.includes("testng") || 
      lowerSkill.includes("postman") || lowerSkill.includes("jmeter") || 
      lowerSkill.includes("testrail") || lowerSkill.includes("jira") || 
      lowerSkill.includes("testing") || lowerSkill.includes("qa") || 
      lowerSkill.includes("quality assurance") || lowerSkill.includes("test automation")) {
    return "QA";
  }
  
  // Project Delivery skills
  if (lowerSkill.includes("agile") || lowerSkill.includes("scrum") || 
      lowerSkill.includes("kanban") || lowerSkill.includes("waterfall") || 
      lowerSkill.includes("linear") || lowerSkill.includes("ms project") || 
      lowerSkill.includes("risk management") || lowerSkill.includes("reporting") || 
      lowerSkill.includes("documentation") || lowerSkill.includes("project delivery")) {
    return "PROJECT_DELIVERY";
  }
  
  // Technical skills
  if (lowerSkill.includes("java") || lowerSkill.includes("python") || 
      lowerSkill.includes("node.js") || lowerSkill.includes("c++") || lowerSkill.includes("c#") || 
      lowerSkill.includes("sql") || lowerSkill.includes("no sql") || lowerSkill.includes("ruby") ||
      lowerSkill.includes("swift") || lowerSkill.includes("kotlin") || lowerSkill.includes("cyber") ||
      lowerSkill.includes("networking") || lowerSkill.includes("database admin") || 
      lowerSkill.includes("devops") || lowerSkill.includes("aws") || lowerSkill.includes("docker") ||
      lowerSkill === "data science" || lowerSkill === "machine learning" || 
      lowerSkill === "artificial intelligence") {
    return "TECH";
  }
  
  // Design skills
  if (lowerSkill.includes("photoshop") || lowerSkill.includes("illustrator") || 
      lowerSkill.includes("indesign") || lowerSkill.includes("sketch") || 
      lowerSkill.includes("figma") || lowerSkill.includes("animation") || 
      lowerSkill.includes("digital illustration") || lowerSkill.includes("ui/ux") ||
      lowerSkill.includes("graphic design") || lowerSkill.includes("video editing") ||
      lowerSkill.includes("interaction design") || lowerSkill.includes("wireframing") ||
      lowerSkill.includes("prototyping") || lowerSkill.includes("design systems") ||
      lowerSkill.includes("visual design") || lowerSkill.includes("typography") ||
      lowerSkill.includes("accessibility") || lowerSkill.includes("motion ui") ||
      lowerSkill.includes("branding") || lowerSkill.includes("frontend handoff") ||
      lowerSkill.includes("lottie") || lowerSkill.includes("product research") ||
      lowerSkill.includes("design") && !lowerSkill.includes("data")) {
    return "DESIGN";
  }
  
  if (lowerSkill.includes("marketing") || lowerSkill.includes("seo") || 
      lowerSkill.includes("social") || lowerSkill.includes("content") || 
      lowerSkill.includes("brand") || lowerSkill.includes("campaign") || 
      lowerSkill.includes("copywriting")) {
    return "MARKETING";
  }
  
  if (lowerSkill.includes("sales") || lowerSkill.includes("account") || 
      lowerSkill.includes("lead") || lowerSkill.includes("negotiation") || 
      lowerSkill.includes("customer") || lowerSkill.includes("public speaking") || 
      lowerSkill.includes("persuasive")) {
    return "SALES";
  }
  
  // HR skills
  if (lowerSkill.includes("recruitment") || lowerSkill.includes("talent") || 
      lowerSkill.includes("employee") || lowerSkill.includes("performance") || 
      lowerSkill.includes("training and development") || lowerSkill.includes("labor laws") || 
      lowerSkill.includes("workplace safety") || lowerSkill.includes("compensation") ||
      lowerSkill.includes("benefits") || lowerSkill.includes("diversity")) {
    return "HR";
  }
  
  if (lowerSkill.includes("financial") || lowerSkill.includes("accounting") || 
      lowerSkill.includes("taxation") || lowerSkill.includes("auditing") || 
      lowerSkill.includes("budgeting") || lowerSkill.includes("cost") || 
      lowerSkill.includes("bookkeeping")) {
    return "ACCOUNTS";
  }
  
  if (lowerSkill.includes("supply chain") || lowerSkill.includes("project") || 
      lowerSkill.includes("operational") || lowerSkill.includes("quality") || 
      lowerSkill.includes("logistics") || lowerSkill.includes("procurement") || 
      lowerSkill.includes("inventory") || lowerSkill.includes("change management")) {
    return "OPERATIONS";
  }
  
  
  return "FRONTEND"; // Default category changed from TECH to FRONTEND
};

interface SkillSelectorProps {
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label: string;
  excludeList?: string[];
  filterCategories?: string[];
}

export function SkillSelector({ 
  options, 
  selectedValues, 
  onChange, 
  label,
  excludeList = [],
  filterCategories = []
}: SkillSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter out skills that are in the exclude list and match category filter if provided
  const availableOptions = options.filter(option => {
    // Always exclude skills in the exclude list
    if (excludeList.includes(option)) return false;
    
    // If category filters are provided, only show skills in those categories
    if (filterCategories.length > 0) {
      const category = getCategoryForSkill(option);
      return filterCategories.includes(category);
    }
    
    return true;
  });
  
  // Filter skills based on search query
  const filteredOptions = availableOptions.filter(option => 
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group skills by category for display
  const groupedOptions = filteredOptions.reduce((acc, skill) => {
    const category = getCategoryForSkill(skill);
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, string[]>);
  
  const handleToggleSkill = (skill: string) => {
    if (selectedValues.includes(skill)) {
      onChange(selectedValues.filter(s => s !== skill));
    } else {
      onChange([...selectedValues, skill]);
    }
  };
  
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      
      {/* Selected skills */}
      <div className="flex flex-wrap gap-2 min-h-[50px] p-2 border rounded-md bg-white">
        {selectedValues.length > 0 ? (
          selectedValues.map(skill => {
            const category = getCategoryForSkill(skill);
            const { color, icon } = SKILL_CATEGORIES[category];
            
            return (
              <div 
                key={skill}
                className={cn(
                  "group flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium transition-all",
                  color,
                  "hover:shadow-md"
                )}
              >
                <span>{icon}</span>
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleToggleSkill(skill)}
                  className="ml-1 rounded-full p-0.5 hover:bg-white/20"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-gray-400 text-sm flex items-center h-7 px-2">
            No {label.toLowerCase()} selected
          </div>
        )}
      </div>
      
      {/* Search and Skill selection */}
      <div className="border rounded-md overflow-hidden bg-white">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={`Search ${label.toLowerCase()}...`}
            className="pl-9 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <ScrollArea className="h-64 border-t">
          <div className="p-2">
            {Object.entries(groupedOptions).map(([category, skills]) => (
              <div key={category} className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider px-2">
                  {SKILL_CATEGORIES[category].icon} {category}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {skills.map(skill => {
                    const isSelected = selectedValues.includes(skill);
                    const { color } = SKILL_CATEGORIES[category];
                    
                    return (
                      <button
                        key={skill}
                        type="button"
                        className={cn(
                          "text-left px-3 py-2 rounded-md text-sm transition-all hover:shadow", 
                          isSelected ? color : "bg-gray-50 hover:bg-gray-100"
                        )}
                        onClick={() => handleToggleSkill(skill)}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {filteredOptions.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No skills found matching "{searchQuery}"
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
