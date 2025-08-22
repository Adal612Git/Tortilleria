#!/usr/bin/env bash
set -euo pipefail

# === Configuración inicial ===
REPO_URL="git@github.com:usuario/mi-repo.git"   # SSH u https
WORKDIR="$HOME/tmp/mi-repo"                     # carpeta local de trabajo (clona aquí si no existe)
DEFAULT_BRANCH="main"
BRANCH_NAME="adr/0001-stack-desktop"            # rama de trabajo
ADR_NUM="0001"
ADR_SLUG="stack-desktop-nativephp"
ADR_FILE="docs/adr/${ADR_NUM}-${ADR_SLUG}.md"
PR_TITLE="ADR-0001: Stack Desktop Offline (Laravel + NativePHP + Vue 3 + Tailwind)"
PR_LABELS="Docs,EPIC,Architecture"              # separadas por coma
PR_REVIEWERS="user1,user2"                      # logins GitHub separados por coma
CLIENT_OK_FILE=""                                # opcional: ruta a un .txt/.png/.pdf con el “OK” del cliente
CLIENT_OK_TEXT=""                                # opcional: texto directo del “OK” (si no hay archivo)
AUTO_MERGE="true"                                # "true" para `gh pr merge --auto`
TAG_NAME="adr-0001-approved"
UPDATE_README="true"                             # insertar link del ADR en README
ADR_INLINE_CONTENT=""                            # pega aquí el contenido Markdown del ADR (opcional). Si vacío, abrir editor.

# === Verificación de prerequisitos ===
for cmd in git gh; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Error: se requiere '$cmd' instalado y en PATH." >&2
    exit 1
  fi
done

if ! gh auth status >/dev/null 2>&1; then
  echo "Error: GitHub CLI no autenticado. Ejecuta 'gh auth login'." >&2
  exit 1
fi

# === Preparación del repositorio ===
if [ ! -d "$WORKDIR" ]; then
  git clone "$REPO_URL" "$WORKDIR"
else
  git -C "$WORKDIR" fetch
  git -C "$WORKDIR" checkout "$DEFAULT_BRANCH"
  git -C "$WORKDIR" pull
fi

cd "$WORKDIR"

git checkout "$DEFAULT_BRANCH"
git pull
git checkout -B "$BRANCH_NAME"

mkdir -p "$(dirname "$ADR_FILE")"

if [ -n "$ADR_INLINE_CONTENT" ]; then
  printf "%s\n" "$ADR_INLINE_CONTENT" > "$ADR_FILE"
else
  EDITOR=${EDITOR:-nano}
  "$EDITOR" "$ADR_FILE"
fi

if ! grep -q "^# ADR-${ADR_NUM}" "$ADR_FILE"; then
  TODAY=$(date +%Y-%m-%d)
  TEMP=$(mktemp)
  echo "# ADR-${ADR_NUM}: ${PR_TITLE#ADR-${ADR_NUM}: }" > "$TEMP"
  echo "" >> "$TEMP"
  echo "Fecha: ${TODAY}" >> "$TEMP"
  echo "" >> "$TEMP"
  cat "$ADR_FILE" >> "$TEMP"
  mv "$TEMP" "$ADR_FILE"
fi

git add "$ADR_FILE"
git commit -m "ADR-${ADR_NUM}: ${ADR_SLUG} (stack desktop)"
git push -u origin "$BRANCH_NAME"

REPO_NAME=$(gh repo view --json nameWithOwner -q .nameWithOwner)
PR_BODY="Este PR agrega ADR-${ADR_NUM}. Revisa el documento en "
PR_BODY+="[docs/adr/${ADR_NUM}-${ADR_SLUG}.md]"
PR_BODY+="(https://github.com/${REPO_NAME}/blob/${BRANCH_NAME}/${ADR_FILE})."

gh pr create --base "$DEFAULT_BRANCH" --head "$BRANCH_NAME" --title "$PR_TITLE" --body "$PR_BODY" >/dev/null
PR_URL=$(gh pr view --json url -q .url)

IFS=',' read -ra LABEL_ARRAY <<< "$PR_LABELS"
for label in "${LABEL_ARRAY[@]}"; do
  label=$(echo "$label" | xargs)
  [ -n "$label" ] && gh pr edit "$PR_URL" --add-label "$label" >/dev/null || true
fi

IFS=',' read -ra REVIEW_ARRAY <<< "$PR_REVIEWERS"
for reviewer in "${REVIEW_ARRAY[@]}"; do
  reviewer=$(echo "$reviewer" | xargs)
  [ -n "$reviewer" ] && gh pr edit "$PR_URL" --add-reviewer "$reviewer" >/dev/null || true
fi

if [ -n "$CLIENT_OK_FILE" ] && [ -f "$CLIENT_OK_FILE" ]; then
  gh pr comment "$PR_URL" --body "OK del cliente adjunto." --attach "$CLIENT_OK_FILE" >/dev/null
elif [ -n "$CLIENT_OK_TEXT" ]; then
  gh pr comment "$PR_URL" --body "OK del cliente: $CLIENT_OK_TEXT" >/dev/null
fi

PR_STATE=$(gh pr view --json state -q .state)

if [ "$AUTO_MERGE" = "true" ]; then
  if gh pr merge --squash --auto >/dev/null 2>&1; then
    echo "El PR hará merge automático cuando haya 2 approvals y checks ok"
  else
    echo "No se pudo habilitar auto merge; deberás hacerlo manualmente." >&2
  fi
else
  echo "Para fusionar manualmente ejecuta: gh pr merge $PR_URL --squash"
fi

for i in {1..30}; do
  PR_STATE=$(gh pr view --json state -q .state)
  [ "$PR_STATE" = "MERGED" ] && break
  sleep 10
done

if [ "$PR_STATE" = "MERGED" ]; then
  git checkout "$DEFAULT_BRANCH"
  git pull
  git tag -a "$TAG_NAME" -m "ADR ${ADR_NUM} aprobado"
  git push --tags
fi

if [ "$UPDATE_README" = "true" ]; then
  README_FILE="README.md"
  if ! grep -q "^## ADRs" "$README_FILE"; then
    printf "\n## ADRs\n" >> "$README_FILE"
  fi
  ADR_LINE="- [ADR-${ADR_NUM}: ${PR_TITLE#ADR-${ADR_NUM}: }](docs/adr/${ADR_NUM}-${ADR_SLUG}.md)"
  if ! grep -Fq "$ADR_LINE" "$README_FILE"; then
    printf "%s\n" "$ADR_LINE" >> "$README_FILE"
    git add "$README_FILE"
    git commit -m "Docs: link ADR-${ADR_NUM} en README"
    git push
  fi
fi

ADR_PATH="$ADR_FILE"
if [ "$PR_STATE" = "MERGED" ]; then
  ADR_PATH_BRANCH="$DEFAULT_BRANCH"
else
  ADR_PATH_BRANCH="$BRANCH_NAME"
fi

echo "Archivo ADR: $ADR_PATH (rama: $ADR_PATH_BRANCH)"
echo "PR URL: $PR_URL"
echo "Estado del PR: $PR_STATE"
[ "$PR_STATE" = "MERGED" ] && echo "Tag creado: $TAG_NAME"
echo "Recordatorio: adjunta en Trello el link al archivo, al PR y la evidencia del OK del cliente."
