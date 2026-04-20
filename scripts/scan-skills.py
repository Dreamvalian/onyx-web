#!/usr/bin/env python3
"""Scan ~/.hermes/skills and extract SKILL.md frontmatter into JSON."""
import os
import re
import json
import sys

SKILLS_DIR = os.path.expanduser("~/.hermes/skills")

# Category mapping from name prefixes
NAME_CATEGORIES = {
    'implementing-': 'security',
    'performing-': 'security',
    'testing-': 'security',
    'detecting-': 'security',
    'scanning-': 'security',
    'configuring-': 'security',
    'securing-': 'security',
    'hardening-': 'security',
    'triaging-': 'security',
    'collecting-': 'security',
    'recovering-': 'security',
    'monitoring-': 'security',
    'deploying-': 'security',
    'building-': 'security',
    'processing-': 'security',
    'prioritizing-': 'security',
    'auditing-': 'security',
    'automating-': 'automation',
    'analyzing-': 'security',
}

def categorize_from_name(name: str) -> str:
    """Derive category from skill name prefix."""
    for prefix, cat in NAME_CATEGORIES.items():
        if name.startswith(prefix):
            return cat
    return ''

def parse_frontmatter(content: str) -> dict:
    """Extract YAML frontmatter from SKILL.md."""
    match = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return {}
    
    fm = {}
    raw = match.group(1)
    
    for line in raw.split('\n'):
        line = line.strip()
        if ':' in line:
            key, _, val = line.partition(':')
            key = key.strip()
            val = val.strip().strip('"').strip("'")
            if key in ('name', 'description', 'category', 'version', 'license'):
                fm[key] = val
            elif key == 'tags':
                val = val.strip('[]')
                fm['tags'] = [t.strip().strip('"').strip("'") for t in val.split(',') if t.strip()]
    
    meta_match = re.search(r'metadata:\s*\n((?:\s+.*\n)*)', raw)
    if meta_match:
        for line in meta_match.group(1).split('\n'):
            line = line.strip()
            if ':' in line:
                key, _, val = line.partition(':')
                key = key.strip()
                val = val.strip().strip('"').strip("'")
                if key == 'category':
                    fm['category'] = val
                elif key == 'tags':
                    val = val.strip('[]')
                    fm['tags'] = [t.strip().strip('"').strip("'") for t in val.split(',') if t.strip()]

    return fm

def scan_skills(base_dir: str) -> list:
    skills = []
    
    for root, dirs, files in os.walk(base_dir):
        if 'SKILL.md' not in files:
            continue
        
        skill_path = os.path.join(root, 'SKILL.md')
        rel_path = os.path.relpath(root, base_dir)
        
        try:
            with open(skill_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read(4096)
            
            fm = parse_frontmatter(content)
            
            name = fm.get('name', os.path.basename(root))
            desc = fm.get('description', '')
            category = fm.get('category', '')
            tags = fm.get('tags', [])
            version = fm.get('version', '')
            
            # Derive category from path if not in frontmatter
            if not category:
                parts = rel_path.split('/')
                if len(parts) > 1:
                    category = parts[0]
                else:
                    # Try name-based categorization
                    category = categorize_from_name(name) or 'other'
            
            if len(desc) > 200:
                desc = desc[:197] + '...'
            
            skills.append({
                'name': name,
                'description': desc,
                'category': category,
                'tags': tags if isinstance(tags, list) else [],
                'version': version,
                'path': rel_path,
            })
        except Exception as e:
            print(f"Error reading {skill_path}: {e}", file=sys.stderr)
    
    return sorted(skills, key=lambda s: s['name'].lower())

if __name__ == '__main__':
    skills = scan_skills(SKILLS_DIR)
    
    categories = {}
    for s in skills:
        cat = s['category'] or 'other'
        categories[cat] = categories.get(cat, 0) + 1
    
    output = {
        'total': len(skills),
        'categories': dict(sorted(categories.items(), key=lambda x: -x[1])),
        'skills': skills,
    }
    
    print(json.dumps(output, indent=2))
