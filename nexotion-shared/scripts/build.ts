import * as esbuild from 'esbuild'
import { copyFileSync } from 'fs'
import path from 'path'
const glob = require('glob')
const { exec } = require('child_process')
const util = require('util')

const execPromise = util.promisify(exec)

function getEntryPoints() {
  return glob.sync('src/**/*.ts')
    .filter(file => !file.includes('.specs.') && !file.includes('.spec.'))
}

async function generateDeclarations() {
  try {
    await execPromise('npx tsc --declaration --emitDeclarationOnly --outDir build/types')
  } catch (error) {
    console.error('Failed to generate type declarations:', error)
    throw error
  }
}

async function build() {
  const entryPoints = getEntryPoints()
  // CommonJS build
  await esbuild.build({
    entryPoints,
    outdir: 'build/cjs',
    format: 'cjs',
    platform: 'node',
    target: 'es2020',
    sourcemap: true,
  })

  // ESM build
  await esbuild.build({
    entryPoints,
    outdir: 'build/esm',
    format: 'esm',
    platform: 'node',
    target: 'es2020',
    sourcemap: true,
  })

  // Generate type declarations
  await generateDeclarations()

  // Copy package.json
  copyFileSync(
    path.resolve(process.cwd(), 'package.json'), 
    path.resolve(process.cwd(), 'build/package.json')
  )
}

build().catch(() => process.exit(1))