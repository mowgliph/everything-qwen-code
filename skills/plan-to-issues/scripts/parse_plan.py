#!/usr/bin/env python3
"""Parse writing-plans output and extract tasks.

Expected markdown format:
    ### Task N: Task Title

    **Files:**
    - Create: `path/to/file`
    - Modify: `path/to/file`

    **Step 1: Step title**
    step content...

    **Step 2: Another step**
    more content...
"""

import re
import sys
import json
import os
import glob


def extract_tasks(plan_text: str) -> list[dict]:
    """Extract task blocks from a plan markdown file.

    Returns list of dicts with keys: number, title, files, steps
    """
    # Match '### Task N: Title' headings
    task_pattern = re.compile(
        r'^### Task (\d+): (.+)$',
        re.MULTILINE
    )

    tasks = []
    matches = list(task_pattern.finditer(plan_text))

    for i, match in enumerate(matches):
        number = int(match.group(1))
        title = match.group(2).strip()
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(plan_text)
        body = plan_text[start:end]

        # Extract **Files:** block (raw markdown bullets)
        files_match = re.search(r'\*\*Files:\*\*\n(.*?)(?=\n\*\*Step|\Z)', body, re.DOTALL)
        files = files_match.group(1).strip() if files_match else ''

        # Extract **Step N: title** blocks with their content
        steps = re.findall(r'\*\*Step \d+: (.+?)\*\*\n(.*?)(?=\*\*Step |\Z)', body, re.DOTALL)
        steps = [{'title': s[0].strip(), 'content': s[1].strip()} for s in steps]

        tasks.append({
            'number': number,
            'title': title,
            'files': files,
            'steps': steps,
        })

    return tasks


def detect_labels(task: dict) -> list[str]:
    """Auto-detect labels from task content using keyword matching."""
    label_map = {
        'testing': ['test', 'pytest', 'failing', 'TDD', 'unittest'],
        'api': ['API', 'endpoint', 'route', 'handler'],
        'frontend': ['UI', 'component', 'frontend', 'view', 'template'],
        'database': ['database', 'schema', 'migration', 'query', 'model'],
        'security': ['auth', 'security', 'validation', 'token', 'permission'],
        'documentation': ['docs', 'README', 'changelog', 'documentation'],
        'refactor': ['refactor', 'cleanup', 'dead code', 'restructure'],
        'devops': ['config', 'env', 'deploy', 'CI', 'CD', 'pipeline'],
        'enhancement': ['feat', 'add', 'new', 'feature'],
        'bug': ['fix', 'bug', 'error', 'patch'],
    }

    searchable = f"{task['title']} {task['files']} "
    searchable += ' '.join(s['title'] + ' ' + s['content'] for s in task['steps'])

    labels = []
    for label, keywords in label_map.items():
        if any(kw.lower() in searchable.lower() for kw in keywords):
            labels.append(label)

    return labels if labels else ['task']


def main() -> None:
    """CLI entry point: parse a plan file and output JSON."""
    if len(sys.argv) < 2:
        print("Usage: parse_plan.py <plan_file.md>")
        sys.exit(1)

    plan_file = sys.argv[1]
    try:
        with open(plan_file, 'r', encoding='utf-8') as f:
            plan_text = f.read()
    except FileNotFoundError:
        print(f"Error: Plan file not found: {plan_file}", file=sys.stderr)
        sys.exit(1)

    tasks = extract_tasks(plan_text)

    for task in tasks:
        task['labels'] = detect_labels(task)

    print(json.dumps(tasks, indent=2))


def find_latest_plan(plans_dir: str) -> str | None:
    """Find the most recent plan file in docs/plans/."""
    pattern = os.path.join(plans_dir, '*.md')
    files = glob.glob(pattern)
    if not files:
        return None
    return max(files, key=os.path.getmtime)


if __name__ == '__main__':
    main()
