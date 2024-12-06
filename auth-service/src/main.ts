import 'reflect-metadata';
import { container } from './infrastructure/dependency-injection/container';
import { ApplicationInitializer } from './infrastructure/app-initializer';


async function main() {
  const initializer = new ApplicationInitializer(container);
  await initializer.initialize();
}

main().catch(console.error);